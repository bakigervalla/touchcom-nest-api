import * as admin from 'firebase-admin';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { MailDataRequired, MailService } from '@sendgrid/mail';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { jwt, Twilio, twiml } from 'twilio';
import { VerificationCheckListInstanceCreateOptions } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { VerificationListInstanceCreateOptions } from 'twilio/lib/rest/verify/v2/service/verification';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createHash } from 'crypto';

import { Call, Permission } from '@common/types';
import { DeviceDto } from '@devices/dto';
import { PrismaService } from '@~prisma/prisma.service';
import { UserDto } from '@users/dto';

import { SendgridConfig, TwilioConfig } from '@common/configs/config.interface';

import {
  AccessTokenRequestDto,
  CallDataDto,
  TokenDto,
  VerificationStatusDto,
} from './dto';
import { DeviceStatus, PermissionType } from '@prisma/client';

enum CallPermission {
  ENABLE_VOICE = 'ENABLE_VOICE',
  ENABLE_VIDEO = 'ENABLE_VIDEO',
}

@Injectable()
export class TwilioService {
  private readonly BASE_PATH: string;
  private readonly twilioClient: Twilio;
  private readonly mailService: MailService;
  private readonly twilioConfig: TwilioConfig;
  private readonly sendgridConfig: SendgridConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('DEVICE_SERVICE') private readonly mqttClient: ClientProxy,
  ) {
    this.BASE_PATH = this.getBasePath(this.request);
    this.twilioConfig = this.configService.get<TwilioConfig>('twilio');
    this.sendgridConfig = this.configService.get<SendgridConfig>('sendgrid');
    this.mailService = new MailService();
    this.mailService.setApiKey(this.sendgridConfig.apiKey);
    this.twilioClient = new Twilio(
      this.twilioConfig.accountSid,
      this.twilioConfig.authToken,
    );
  }

  async getAccessToken(
    user: UserDto,
    payload: AccessTokenRequestDto,
  ): Promise<TokenDto> {
    const accessToken = new jwt.AccessToken(
      this.twilioConfig.accountSid,
      this.twilioConfig.apiKey,
      this.twilioConfig.apiKeySecret,
      { identity: user.email },
    );

    const videoRoomName = await this.getVideoRoomName(user, payload.deviceId);

    const voiceGrant = new jwt.AccessToken.VoiceGrant({
      pushCredentialSid: this.twilioConfig.pushCredentialSid,
      outgoingApplicationSid: this.twilioConfig.outgoingApplicationSid,
    });
    accessToken.addGrant(voiceGrant);

    const videoGrant = new jwt.AccessToken.VideoGrant({
      room: videoRoomName,
    });
    accessToken.addGrant(videoGrant);

    return { accessToken: accessToken.toJwt(), videoRoomName };
  }

  async initiateVerification(
    serviceId: string,
    options: VerificationListInstanceCreateOptions,
  ): Promise<VerificationStatusDto> {
    const verification = await this.twilioClient.verify.v2
      .services(serviceId)
      .verifications.create(options);

    return { status: verification.status };
  }

  async verify(
    serviceId: string,
    options: VerificationCheckListInstanceCreateOptions,
  ): Promise<VerificationStatusDto> {
    const verificationCheck = await this.twilioClient.verify.v2
      .services(serviceId)
      .verificationChecks.create(options);

    return { status: verificationCheck.status };
  }

  async sendEmail(options: MailDataRequired): Promise<void> {
    await this.mailService.send(options);
  }

  async storeFcmToken(user: UserDto, payload: any): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { fcmToken: payload.token },
    });
  }

  async initiateCall(payload: CallDataDto): Promise<string> {
    const voiceResponse = new twiml.VoiceResponse();
    const callType = payload.email ? Call.VOIP : Call.GSM;
    const user = await this.prisma.user.findFirst({
      where: {
        ...(payload.phone
          ? { phone: payload.phone }
          : { email: payload.email }),
      },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    if (!user) {
      voiceResponse.say("Call can't be made, callee not found!");
      return voiceResponse.toString();
    }

    const device = await this.prisma.device.findFirst({
      where: { id: payload.deviceId },
      include: {
        configuration: true,
        site: { include: { address: { include: { country: true } } } },
      },
    });

    if (!device) {
      voiceResponse.say("Call can't be made, device not found!");
      return voiceResponse.toString();
    }

    this.logger.info(
      `${callType} call request to ${user.phone} received from device ${device.name} (ID: ${device.id})}`,
      `${TwilioService.name} [initiateCall]`,
    );

    return this.processCall(callType, user, device, payload.CallSid);
  }

  async joinCall(conferenceId: string): Promise<string> {
    const voiceResponse = this.joinConference(conferenceId);

    return voiceResponse.toString();
  }

  async dropRoom(roomName: string): Promise<void> {
    try {
      const room = await this.twilioClient.video.v1.rooms(roomName).fetch();

      await this.twilioClient.video.v1
        .rooms(room.sid)
        .update({ status: 'completed' });
    } catch (error) {}
  }

  async dropCall(callSid: string): Promise<string> {
    const voiceResponse = new twiml.VoiceResponse();
    voiceResponse.say('Touchcom call dropped!');

    try {
      await this.twilioClient.calls(callSid).update({ status: 'completed' });
    } catch (error) {}

    return voiceResponse.toString();
  }

  async callStatus(callSid: string): Promise<string> {
    try {
      const call = await this.twilioClient.calls(callSid).fetch();
      return call.status;
    } catch (error) {}
  }

  async createDtmfInstructions(conferenceId: string): Promise<string> {
    const voiceResponse = this.joinConference(conferenceId);
    const gather = voiceResponse.gather({
      numDigits: 1,
      action: `${this.BASE_PATH}/twilio/process-dtmf-input?conferenceId=${conferenceId}`,
      method: 'POST',
    });
    gather.say(
      'Welcome to Touchcom! You have entered voice service which will guide you through possible actions. Press 1 if you want to open doors. Press # to exit.',
    );

    voiceResponse.redirect(
      `${this.BASE_PATH}/twilio/dtmf-instructions?conferenceId=${conferenceId}`,
    );

    return voiceResponse.toString();
  }

  async processDtmfInput(conferenceId: string, payload: any): Promise<string> {
    const voiceResponse = new twiml.VoiceResponse();

    if ('Digits' in payload) {
      const choice = payload.Digits;
      switch (choice) {
        case '1':
          voiceResponse.say('Opening doors.');
          this.mqttClient.emit(`device/${conferenceId}/open_door`, {});
          return voiceResponse.toString();
        default:
          voiceResponse.say('Sorry, selected choice is not available.');
          voiceResponse.pause();
          voiceResponse.redirect(
            `${this.BASE_PATH}/twilio/dtmf-instructions?conferenceId=${conferenceId}`,
          );
          return voiceResponse.toString();
      }
    }

    voiceResponse.say('Please select an option.');

    return voiceResponse.toString();
  }

  async callCallback(payload: any): Promise<void> {
    console.log('In call callback');
    console.log(payload);
    const { CallSid, CallStatus, calleeId, roomName } = payload;

    if (['busy', 'completed', 'no-answer'].includes(CallStatus)) {
      console.log('Ending call');
      await this.dropCall(CallSid[0]);
      await this.dropRoom(roomName[0]);
    }

    const user = await this.prisma.user.findFirst({
      where: { id: parseInt(calleeId, 10) },
    });

    if (!user) {
      return;
    }
  }

  async participantCallback(payload: any): Promise<void> {
    console.log('In participant callback');
    console.log(payload);
  }

  async roomCallback(payload: any): Promise<void> {
    console.log('In room callback');
    console.log(payload);
  }

  async conferenceCallback(payload: any): Promise<void> {
    console.log('In conference callback');
    console.log(payload);
  }

  private async processCall(
    callType: Call,
    user: UserDto,
    device: DeviceDto,
    callSid: string,
  ): Promise<string> {
    switch (callType) {
      case Call.VOIP:
        return this.processVOIP(user, device, callSid);
      case Call.GSM:
        return this.processGSM(user, device);
      default:
        return this.processVOIP(user, device, callSid);
    }
  }

  private async processVOIP(
    user: UserDto,
    device: DeviceDto,
    callSid: string,
  ): Promise<string> {
    const voiceResponse = this.createConference(device.serialNumber);

    const twilioTokenData = await this.getAccessToken(user, {
      deviceId: device.id,
    });
    await admin.messaging().send({
      token: user.fcmToken,
      data: {
        callSid,
        deviceId: device.id.toString(),
        deviceName: device.name,
        deviceSerialNumber: device.serialNumber,
        deviceCloseDoorTime:
          device?.configuration?.closeDoorTime?.toString() ?? '10',
        accessToken: twilioTokenData.accessToken,
        roomName: twilioTokenData.videoRoomName,
      },
      apns: {
        headers: {
          'apns-expiration': '1604750400',
        },
      },
      android: { ttl: 4500 },
      webpush: { headers: { TTL: '4500' } },
    });

    return voiceResponse.toString();
  }

  private async processGSM(user: UserDto, device: DeviceDto): Promise<string> {
    const voiceResponse = this.createConference(device.serialNumber);

    await this.twilioClient.calls.create({
      to: user.phone,
      from: this.twilioConfig.callerPhoneNumber,
      url: `${this.BASE_PATH}/twilio/dtmf-instructions?conferenceId=${device.serialNumber}`,
      method: 'GET',
      timeout: 30,
      statusCallback: `${this.BASE_PATH}/twilio/call-callback?calleeId=${user.id}&conferenceId=${device.serialNumber}`,
      statusCallbackMethod: 'GET',
    });

    return voiceResponse.toString();
  }

  private createConference(name: string): VoiceResponse {
    const voiceResponse = new twiml.VoiceResponse();
    const dial = voiceResponse.dial({
      callerId: this.twilioConfig.callerPhoneNumber,
      timeout: 30,
    });

    dial.conference(
      {
        beep: 'false',
        waitUrl: '',
        startConferenceOnEnter: true,
        endConferenceOnExit: true,
      },
      name,
    );
    return voiceResponse;
  }

  private joinConference(name: string): VoiceResponse {
    const voiceResponse = new twiml.VoiceResponse();
    const dial = voiceResponse.dial();
    dial.conference(name);
    return voiceResponse;
  }

  private async getVideoRoomName(
    user: UserDto,
    deviceId: number,
  ): Promise<string> {
    const roomHash = createHash('sha256')
      .update(`${user.id}_${user.email}`)
      .digest('hex');
    let videoRoomName = `touchcom_video_room_${roomHash}`;

    const isDeviceUser = user.role.permissions.some(
      (rolePermission) => rolePermission.permission.key === Permission.DEVICE,
    );
    const userDevice = await this.prisma.accessControl.findFirst({
      where: { userId: user.id, deviceId, status: DeviceStatus.ACTIVE },
    });

    if (userDevice && !isDeviceUser) {
      const device = await this.prisma.device.findFirst({
        where: { id: deviceId },
      });
      videoRoomName = device.twilioRoomName;
    } else if (userDevice && isDeviceUser) {
      await this.prisma.device.update({
        where: { id: deviceId },
        data: {
          twilioRoomName: videoRoomName,
        },
      });
    }

    return videoRoomName;
  }

  private checkCallPermission(user: UserDto, callPermission: CallPermission) {
    return user.role.permissions.some(
      (permission) =>
        permission.permission.type === PermissionType.CALL &&
        permission.permission.key === callPermission,
    );
  }

  private getBasePath(request: Request): string {
    const protocol = request.protocol;
    const host = request.headers.host;

    return `${protocol}://${host}`;
  }
}
