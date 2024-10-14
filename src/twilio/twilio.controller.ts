import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { JwtAuthGuard } from '@auth/strategy';
import { Permission } from '@common/types';
import { UserDto } from '@users/dto';

import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { SessionUser } from '@common/decorators/user.decorator';

import { AccessTokenRequestDto, CallDataDto, TokenDto } from './dto';
import { TwilioService } from './twilio.service';

@Controller('twilio')
@ApiTags('Twilio')
@SkipThrottle()
@UseGuards(PermissionsGuard)
export class TwilioController {
  public constructor(private readonly twilioService: TwilioService) {}

  @Post('access-token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Permissions(Permission.DEVICE)
  @ApiCreatedResponse({ type: TokenDto })
  async getAccessToken(
    @SessionUser() user: UserDto,
    @Body() payload: AccessTokenRequestDto,
  ): Promise<TokenDto> {
    return this.twilioService.getAccessToken(user, payload);
  }

  @Post('fcm-token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Permissions(Permission.MOBILE)
  async storeFcmToken(
    @SessionUser() user: UserDto,
    @Body() payload: any,
  ): Promise<void> {
    await this.twilioService.storeFcmToken(user, payload);
  }

  @Post('make-call')
  async makeCall(@Body() payload: CallDataDto): Promise<string> {
    return this.twilioService.initiateCall(payload);
  }

  @Post('join-call')
  async joinCall(@Query('conferenceId') conferenceId: string): Promise<string> {
    return this.twilioService.joinCall(conferenceId);
  }

  @Get('dtmf-instructions')
  async createDtmfInstructions(
    @Query('conferenceId') conferenceId: string,
  ): Promise<string> {
    return this.twilioService.createDtmfInstructions(conferenceId);
  }

  @Post('process-dtmf-input')
  async processDtmfInput(
    @Body() payload: any,
    @Query('conferenceId') conferenceId: string,
  ): Promise<string> {
    return this.twilioService.processDtmfInput(payload, conferenceId);
  }

  @Get('drop-call')
  async dropCall(@Query('callSid') callSid: string): Promise<string> {
    return this.twilioService.dropCall(callSid);
  }

  @Get('drop-room')
  async dropRoom(@Query('roomName') roomName: string): Promise<void> {
    await this.twilioService.dropRoom(roomName);
  }

  @Get('call-status')
  async callStatus(@Query('callSid') callSid: string): Promise<string> {
    return this.twilioService.callStatus(callSid);
  }

  @Get('call-callback')
  async callCallback(@Query() payload: any): Promise<void> {
    await this.twilioService.callCallback(payload);
  }

  @Get('participant-callback')
  async participantCallback(@Query() payload: any): Promise<void> {
    await this.twilioService.participantCallback(payload);
  }

  @Get('room-callback')
  async roomCallback(@Query() payload: any): Promise<void> {
    await this.twilioService.roomCallback(payload);
  }

  @Get('conference-callback')
  async conferenceCallback(@Query() payload: any): Promise<void> {
    await this.twilioService.conferenceCallback(payload);
  }
}
