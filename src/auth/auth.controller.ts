import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { DeviceDto, DeviceRegistrationVerificationDto } from '@devices/dto';
import { Permission } from '@common/types';
import { AcceptInvitationDto, UserDto } from '@users/dto';

import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { SessionUser } from '@common/decorators/user.decorator';

import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDeviceDto,
  LoginDeviceResponseDto,
  LoginDto,
  LoginOtpDto,
  LoginOtpVerificationDto,
  OtpRequestDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from './dto';
import { JwtAuthGuard } from './strategy';
import { Token } from './entities';

@Controller('auth')
@ApiTags('Auth')
@UseGuards(PermissionsGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/admin')
  @Permissions(Permission.ADMIN_WEB)
  @ApiCreatedResponse({ type: Token })
  async loginAdmin(@Body() payload: LoginDto): Promise<Token> {
    return this.authService.login(payload);
  }

  @Post('login/device')
  @ApiCreatedResponse({ type: LoginDeviceResponseDto })
  async loginDevice(
    @Body() payload: LoginDeviceDto,
  ): Promise<LoginDeviceResponseDto> {
    return this.authService.deviceLogin(payload);
  }

  @Post('login/mobile')
  @Permissions(Permission.MOBILE)
  @ApiCreatedResponse({ type: Token })
  async loginMobile(@Body() payload: LoginDto): Promise<Token> {
    return this.authService.login(payload);
  }

  @Post('login/otp-request')
  @ApiCreatedResponse()
  async loginOtp(@Body() payload: LoginOtpDto): Promise<OtpRequestDto> {
    return this.authService.loginOtp(payload);
  }

  @Post('login/otp-verify')
  @ApiCreatedResponse({ type: Token })
  async loginOtpVerify(
    @Body() payload: LoginOtpVerificationDto,
  ): Promise<Token> {
    return this.authService.loginOtpVerify(payload);
  }

  @Post('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserDto })
  @UseInterceptors(new TransformInterceptor(UserDto))
  async changePassword(
    @SessionUser() user: UserDto,
    @Body() payload: ChangePasswordDto,
  ): Promise<UserDto> {
    return this.authService.changePassword(payload, user);
  }

  @Post('forgot-password')
  @ApiCreatedResponse()
  async forgotPassword(@Body() payload: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(payload);
  }

  @Post('reset-password')
  @ApiCreatedResponse()
  async resetPassword(@Body() payload: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(payload);
  }

  @Post('refresh-token')
  @SkipThrottle()
  @ApiCreatedResponse({ type: Token })
  async refreshToken(@Body() payload: RefreshTokenDto): Promise<Token> {
    return this.authService.refreshToken(payload);
  }

  @Post('device-registration-verification')
  @ApiCreatedResponse({ type: DeviceDto })
  async deviceRegistrationVerification(
    @Body() payload: DeviceRegistrationVerificationDto,
  ): Promise<DeviceDto> {
    return this.authService.deviceRegistrationVerification(payload);
  }

  @Post('devices/:id/activate')
  @ApiCreatedResponse({ type: DeviceDto })
  async activateDevice(@Param('id') id: string): Promise<DeviceDto> {
    return this.authService.activateDevice(parseInt(id, 10));
  }

  @Post('devices/:id/change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: DeviceDto })
  async changeDevicePassword(
    @Param('id') id: string,
    @Body() payload: ChangePasswordDto,
    @SessionUser() user: UserDto,
  ): Promise<DeviceDto> {
    return this.authService.changeDevicePassword(
      parseInt(id, 10),
      payload,
      user,
    );
  }

  @Post('sites/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  @ApiCreatedResponse({ type: Token })
  async changeActiveSite(
    @Param('id') id: string,
    @SessionUser() user: UserDto,
  ): Promise<Token> {
    return this.authService.changeActiveSite(user, parseInt(id, 10));
  }

  @Post('invite-accept')
  @ApiCreatedResponse({ type: Token })
  async acceptInvitation(@Body() payload: AcceptInvitationDto): Promise<Token> {
    return this.authService.acceptInvitation(payload);
  }
}
