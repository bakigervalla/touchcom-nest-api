import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClientProxy,
  MessagePattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AccessControlService } from '@access-control/access-control.service';
import { DeviceAccess, PublicErrors } from '@common/types';
import { JwtAuthGuard } from '@auth/strategy';
import { LoginDeviceResponseDto } from '@auth/dto';
import { PermissionDto } from '@permissions/dto';
import { PrismaService } from '@~prisma/prisma.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { UserDto } from '@users/dto';

import common from '@common/utils/common';
import { SessionUser } from '@common/decorators/user.decorator';

import { EventTrigger, Heartbeat } from './entities';

@Controller('mqtt')
@ApiTags('MQTT')
@SkipThrottle()
export class MqttController {
  constructor(
    @Inject('DEVICE_SERVICE') private readonly client: ClientProxy,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly accessControlService: AccessControlService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('event-handler')
  @ApiBearerAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  async handleEvents(
    @SessionUser() sessionUser: UserDto,
    @Body() payload: EventTrigger,
  ) {
    const { deviceId, event, options } = payload;

    if (options && options.isWebTrigger) {
      await this.triggerEvent(sessionUser, payload);
      return;
    }

    const user = await this.prisma.user.findFirst({
      where: { id: sessionUser.id },
      include: { accessControls: { include: { device: true } } },
    });
    const userDeviceAccess = user.accessControls.find(
      (accessControl) => accessControl.device.id === deviceId,
    );

    if (!userDeviceAccess) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_FORBIDDEN,
        message: `You do not have access to requested device`,
      });
    }

    const hasUserPermission = sessionUser.role.permissions.some(
      ({ permission }: { permission: PermissionDto }) =>
        permission.key === event.toUpperCase(),
    );

    if (!hasUserPermission) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACTION_FORBIDDEN,
        message: `You do not have permissions to perform action on requested device`,
      });
    }

    await this.accessControlService.validateUserDeviceAccess(
      sessionUser.id,
      deviceId,
      DeviceAccess.PASSWORD,
    );

    await this.triggerEvent(sessionUser, payload);
  }

  @MessagePattern('heartbeat')
  heartbeat(@Payload() payload: Heartbeat, @Ctx() context: MqttContext) {
    this.logger.info(
      `Received heartbeat from device: ${JSON.stringify(payload)}`,
      `${MqttController.name} [${context.getTopic()}]`,
    );
  }

  @MessagePattern('device/+/update_firmware')
  updateFirmware(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to update firmware`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/update_residents')
  updateResidents(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to update residents`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/update_access_keys')
  updateAccessKeys(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to update access keys`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/update_main_settings')
  updateMainSettings(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to update main settings`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/open_android_settings')
  openAndroidSettings(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to open android settings`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/close_android_settings')
  closeAndroidSettings(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to close android settings`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/open_root_settings')
  openRootSettings(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to open root settings`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/close_root_settings')
  closeRootSettings(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to close root settings`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/open_sound_booster')
  openSoundBooster(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to open sound booster`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/close_sound_booster')
  closeSoundBooster(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to close sound booster`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/open_door')
  async openDoor(@Ctx() context: MqttContext, @Payload() payload: UserDto) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id },
    });

    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to open door from ${common.getUserFullName(
        user,
      )}  (ID: ${payload.id}).`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/reboot')
  reboot(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to reboot`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/reset')
  reset(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request for reset`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/shutdown')
  shutdown(@Ctx() context: MqttContext) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) received request to shutdown`,
      MqttController.name,
    );
  }

  @MessagePattern('device/+/registration-verification')
  registrationVerification(
    @Ctx() context: MqttContext,
    @Payload() payload: LoginDeviceResponseDto & { isApproved: boolean },
  ) {
    const deviceSerialNumber = this.getDeviceSerialNumberFromTopic(
      context.getTopic(),
    );
    this.logger.info(
      `Device (ID: ${deviceSerialNumber}) registration is ${
        payload.isApproved ? 'approved' : 'rejected'
      }`,
      MqttController.name,
    );
  }

  private async triggerEvent(user: UserDto, payload: EventTrigger) {
    const { deviceId, event, options } = payload;

    const device = await this.prisma.device.findFirst({
      where: { id: deviceId },
    });

    this.logger.info(
      `${user.email} triggered "${event}" device event`,
      MqttController.name,
    );
    this.client.emit(`device/${device.serialNumber}/${event}`, options);
  }

  private getDeviceSerialNumberFromTopic(topic: string): string {
    const params = topic.split('/');
    const deviceSerialNumber: any = params[1];
    return deviceSerialNumber || null;
  }
}
