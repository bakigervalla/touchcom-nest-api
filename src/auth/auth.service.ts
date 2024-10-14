import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { omit as _omit } from 'lodash';
import { randomUUID } from 'crypto';
import {
  Role,
  User,
  UserStatus,
  Permission,
  DeviceStatus,
  UserSite,
  Site,
} from '@prisma/client';

import { AccessControlService } from '@access-control/access-control.service';
import { DeviceDto, DeviceRegistrationVerificationDto } from '@devices/dto';
import { DevicesService } from '@devices/devices.service';
import { PrismaService } from '@~prisma/prisma.service';
import { RoleService } from '@roles/role.service';
import { TwilioService } from '@twilio/twilio.service';
import { AcceptInvitationDto, UserDto } from '@users/dto';
import {
  DeviceAccess,
  Environment,
  OtpChannel,
  PublicErrors,
  UserRole,
} from '@common/types';

import {
  SecurityConfig,
  SendgridConfig,
  TwilioConfig,
} from '@common/configs/config.interface';
import { DEVICE } from '@common/utils/constants';

import {
  ChangePasswordDto,
  JwtDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  LoginOtpDto,
  LoginOtpVerificationDto,
  LoginDto,
  OtpRequestDto,
  OTP_REQUEST_COOLDOWN_TIME,
  LoginDeviceDto,
  LoginDeviceResponseDto,
} from './dto';
import { PasswordService } from './password.service';
import { Token } from './entities';

@Injectable()
export class AuthService {
  private readonly environment: string;
  private readonly twilioConfig: TwilioConfig;
  private readonly sendgridConfig: SendgridConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly twilioService: TwilioService,
    private readonly passwordService: PasswordService,
    private readonly accessControlService: AccessControlService,
    private readonly deviceService: DevicesService,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
  ) {
    this.environment = this.configService.get('environment');
    this.twilioConfig = this.configService.get<TwilioConfig>('twilio');
    this.sendgridConfig = this.configService.get<SendgridConfig>('sendgrid');
  }

  async login(payload: LoginDto, isDeviceLogin?: boolean): Promise<Token> {
    const { email, password } = payload;

    const user = await this.validateUserAccess(email, password);

    const tokens = this.generateTokens({
      id: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: user.role,
      activeSite: isDeviceLogin ? user.sites[0].site : null,
    });

    return tokens;
  }

  async deviceLogin(payload: LoginDeviceDto): Promise<LoginDeviceResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    if (!user) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_FORBIDDEN,
        message: "You don't have rights to enter",
      });
    }

    await this.roleService.checkIfUserHasDeviceSetupRole(user);

    let device: DeviceDto = await this.prisma.device.findFirst({
      where: { serialNumber: payload.serialNumber },
    });

    if (!device) {
      device = await this.deviceService.validateDeviceInReview(
        user,
        device,
        payload.serialNumber,
      );
    }

    if ('inReview' in device) {
      return {
        accessToken: null,
        refreshToken: null,
        deviceId: null,
        inReview: true,
      };
    }

    let userDeviceAccess = await this.accessControlService.getUserDeviceAccess(
      user.id,
      device.id,
    );
    if (!userDeviceAccess) {
      device =
        await this.accessControlService.getUserNotAllocatedInactiveDevice(
          user,
          payload.serialNumber,
        );
      userDeviceAccess = await this.accessControlService.getUserDeviceAccess(
        user.id,
        device.id,
      );
    }

    if (userDeviceAccess && device.status === DeviceStatus.INACTIVE) {
      await this.deviceService.invalidateOldDeviceAccess(user);
      device = await this.deviceService.enableDeviceAccess(user, device);
    }

    await this.accessControlService.validateUserDeviceAccess(
      user.id,
      device.id,
      DeviceAccess.PASSWORD,
    );

    const tokens = await this.login(payload, true);

    return { ...tokens, deviceId: device.id, inReview: false };
  }

  async loginOtp(payload: LoginOtpDto): Promise<OtpRequestDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        ...(payload.channel === OtpChannel.EMAIL
          ? { email: payload.input.replace(/\s/g, '').toLowerCase() }
          : { phone: payload.input.replace(/\s/g, '') }),
      },
    });

    if (!user || this.isDummyOtpRequest(user)) {
      return;
    }

    const currentDate = new Date();
    if (currentDate < user.otpRequestCooldownExpiration) {
      const cooldown =
        (user.otpRequestCooldownExpiration.getTime() - currentDate.getTime()) /
        1000;
      throw new BadRequestException({
        code: PublicErrors.ACCESS_DENIED,
        message: `Cooldown period hasn't expired yet`,
        cooldown,
      });
    }

    await this.twilioService.initiateVerification(this.twilioConfig.verifySid, {
      channelConfiguration: {
        substitutions: {
          name: user.firstName,
        },
      },
      to: payload.input,
      channel: payload.channel,
    });

    currentDate.setSeconds(
      currentDate.getSeconds() + OTP_REQUEST_COOLDOWN_TIME,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpRequestCooldownExpiration: currentDate },
    });

    return { otpRequestCooldownExpiration: currentDate };
  }

  async loginOtpVerify(payload: LoginOtpVerificationDto): Promise<Token> {
    const user = await this.prisma.user.findFirst({
      where: {
        ...(payload.channel === OtpChannel.EMAIL
          ? { email: payload.input.toLowerCase() }
          : { phone: payload.input }),
      },
      include: {
        role: { include: { permissions: { select: { permission: true } } } },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid code');
    }

    if (this.isDummyOtpValidation(user, payload.code)) {
      const tokens = this.generateTokens({
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        role: user.role,
        activeSite: null,
      });

      return tokens;
    }

    const verification = await this.twilioService.verify(
      this.twilioConfig.verifySid,
      {
        to: payload.input,
        code: payload.code,
      },
    );

    if (verification.status !== 'approved') {
      throw new BadRequestException('Access is not approved');
    }

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: user.role,
      activeSite: null,
    });

    return tokens;
  }

  async changePassword(
    payload: ChangePasswordDto,
    user: UserDto,
  ): Promise<UserDto> {
    const isPasswordValid = await this.passwordService.validatePassword(
      payload.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_PASSWORD,
        message: 'Password is not valid',
      });
    }

    const hashedPassword = await this.passwordService.hashPassword(
      payload.newPassword,
    );

    const updatedUser = await this.prisma.user.update({
      data: { password: hashedPassword },
      where: { id: user.id },
    });

    return updatedUser;
  }

  async changeDevicePassword(
    id: number,
    payload: ChangePasswordDto,
    user: UserDto,
  ): Promise<DeviceDto> {
    const device = await this.deviceService.getDevice(id, '{}', user);

    if (!device.connectedUser) {
      return device;
    }

    const deviceUser = await this.prisma.user.findFirst({
      where: { id: device.connectedUser.id },
    });
    const isPasswordValid = await this.passwordService.validatePassword(
      payload.oldPassword,
      deviceUser.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_PASSWORD,
        message: 'Password is not valid',
      });
    }

    const hashedPassword = await this.passwordService.hashPassword(
      payload.newPassword,
    );

    await this.prisma.user.update({
      data: { password: hashedPassword },
      where: { id: deviceUser.id },
    });

    return device;
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<void> {
    const user = await this.validateUser(payload.email);

    if (!user) {
      return;
    }

    const token = randomUUID();
    const tokenExpirationTime = new Date();
    tokenExpirationTime.setHours(tokenExpirationTime.getHours() + 1);

    await this.prisma.user.update({
      data: {
        verificationCode: token,
        verificationCodeExpiration: tokenExpirationTime,
      },
      where: { id: user.id },
    });

    await this.twilioService.sendEmail({
      from: 'dev@touchcom.no',
      to: payload.email,
      templateId: this.sendgridConfig.forgotPasswordTemplateId,
      dynamicTemplateData: {
        environment: this.environment,
        name: user.firstName,
        verificationCode: token,
      },
    });
  }

  async resetPassword(payload: ResetPasswordDto): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationCode: payload.passwordResetToken,
        verificationCodeExpiration: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException({
        code: PublicErrors.TOKEN_INVALID,
        message: 'Entered reset token is not valid',
      });
    }

    if (user.status !== UserStatus.ACTIVE) {
      return;
    }

    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    await this.prisma.user.update({
      data: {
        verificationCode: null,
        verificationCodeExpiration: null,
        password: hashedPassword,
      },
      where: { id: user.id },
    });

    await this.twilioService.sendEmail({
      from: 'dev@touchcom.no',
      to: user.email,
      templateId: this.sendgridConfig.resetPasswordTemplateId,
      dynamicTemplateData: {
        environment: this.environment,
        name: user.firstName,
      },
    });
  }

  async validateUser(email: string): Promise<UserDto> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        role: { include: { permissions: { select: { permission: true } } } },
      },
    });
  }

  async refreshToken(payload: { token: string }): Promise<Token> {
    try {
      const tokenData: JwtDto = this.jwtService.verify(payload.token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        id: tokenData.id,
        email: tokenData.email,
        phone: tokenData.phone,
        name: tokenData.name,
        firstName: tokenData.firstName,
        lastName: tokenData.lastName,
        imageUrl: tokenData.imageUrl,
        role: tokenData.role,
        activeSite: tokenData.activeSite,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async deviceRegistrationVerification(
    payload: DeviceRegistrationVerificationDto,
  ): Promise<DeviceDto> {
    const dummySerialNumberCharacter = '-';
    const { device, isApproved } = payload;

    if (device.serialNumber.includes(dummySerialNumberCharacter)) {
      throw new BadRequestException({
        code: PublicErrors.DEVICE_SERIAL_NUMBER_INVALID,
        message:
          'Device serial number is not valid. Make sure to confirm device registration through device itself.',
      });
    }

    const user = await this.prisma.user.findFirst({
      where: { id: payload.user.id },
      include: {
        sites: { include: { site: true } },
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    if (!isApproved) {
      await this.deviceService.removeUnapprovedDevice(user, device);
      return device;
    }

    await this.deviceService.invalidateOldDeviceAccess(user);
    const updatedDevice = await this.deviceService.enableDeviceAccess(
      user,
      _omit(device, [
        'accessControls',
        'site',
        'version',
        'configuration',
        'diagnostics',
      ]),
    );

    await this.authenticateDevice(user, device);

    return updatedDevice;
  }

  async activateDevice(id: number): Promise<DeviceDto> {
    let device: DeviceDto = await this.prisma.device.findFirst({
      where: { id },
    });

    if (
      !device ||
      device.status !== DeviceStatus.INACTIVE ||
      device.serialNumber.includes(DEVICE.DUMMY_SERIAL_NUMBER_CHARACTER)
    ) {
      throw new BadRequestException({
        code: PublicErrors.DEVICE_ACTIVATION_DENIED,
        message: "Device can't be activated",
      });
    }

    device = await this.prisma.device.update({
      where: { id },
      data: { status: DeviceStatus.ACTIVE },
    });

    const deviceSetupRoles = await this.roleService.getDeviceSetupRoles();
    const userDeviceAccess = await this.prisma.accessControl.findFirst({
      where: {
        deviceId: device.id,
        user: { roleId: { in: deviceSetupRoles.map((role) => role.id) } },
      },
      include: {
        user: {
          include: {
            sites: { include: { site: true } },
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
      },
    });
    if (userDeviceAccess) {
      const { user } = userDeviceAccess;
      await this.deviceService.invalidateOldDeviceAccess(user);
      device = await this.deviceService.enableDeviceAccess(user, device);
      await this.authenticateDevice(user, device);
    }

    return device;
  }

  async changeActiveSite(user: UserDto, siteId: number): Promise<Token> {
    const isUserSuperAdmin = user.role.key === UserRole.SUPER_ADMIN;
    const site = await this.prisma.site.findFirst({
      where: { id: siteId },
      include: { address: { include: { country: true } } },
    });

    if (!site) {
      throw new BadRequestException({
        code: PublicErrors.SITE_NOT_FOUND,
        message: 'Unable to change site',
      });
    }

    const userSite = await this.prisma.userSite.findFirst({
      where: { userId: user.id, siteId },
    });

    if (!userSite && !isUserSuperAdmin) {
      throw new BadRequestException({
        code: PublicErrors.SITE_FORBIDDEN,
        message: 'Unable to change site',
      });
    }

    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: user.role,
      activeSite: site,
    });

    return tokens;
  }

  async acceptInvitation(payload: AcceptInvitationDto): Promise<Token> {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationCode: payload.invitationToken,
        verificationCodeExpiration: {
          gte: new Date(),
        },
      },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
        sites: { include: { site: true } },
      },
    });

    if (!user) {
      throw new BadRequestException({
        code: PublicErrors.TOKEN_INVALID,
        message: 'Entered invitation token is not valid',
      });
    }

    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    await this.prisma.user.update({
      data: {
        verificationCode: null,
        verificationCodeExpiration: null,
        status: UserStatus.ACTIVE,
        password: hashedPassword,
      },
      where: { id: user.id },
    });

    await this.twilioService.sendEmail({
      from: 'dev@touchcom.no',
      to: user.email,
      templateId: this.sendgridConfig.newUserInvitationAcceptedTemplateId,
      dynamicTemplateData: {
        environment: this.environment,
        name: user.firstName,
        sites: user.sites,
      },
    });

    const tokens = await this.login({
      email: user.email,
      password: payload.password,
    });

    return tokens;
  }

  private async authenticateDevice(
    user: User & {
      sites: Partial<UserSite & { site: Site }>[];
      role: Role & {
        permissions: { permission: Permission }[];
      };
    },
    device: DeviceDto,
  ): Promise<void> {
    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: user.role,
      activeSite: user.sites[0]?.site ?? null,
    });

    await this.deviceService.sendRegistrationApprovalConfirmation(
      device,
      tokens,
    );
  }

  private async validateUserAccess(
    email: string,
    password: string,
  ): Promise<
    User & {
      sites: Partial<UserSite & { site: Site }>[];
      role: Role & {
        permissions: { permission: Permission }[];
      };
    }
  > {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        sites: { include: { site: true } },
        role: { include: { permissions: { select: { permission: true } } } },
      },
    });

    if (!user) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    if (!user.password) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: `Account is locked`,
      });
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: `Account is in ${user.status.toLowerCase()} state`,
      });
    }

    const isPasswordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    return user;
  }

  private generateTokens(payload: Omit<JwtDto, 'iat' | 'exp'>): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: Omit<JwtDto, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: Omit<JwtDto, 'iat' | 'exp'>): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  private isDummyOtpRequest(user: UserDto): boolean {
    const dummyEmail = 'dev@touchcom.no';
    const dummyPhoneNumber = '+4755555555';

    return (
      (user.email === dummyEmail || user.phone === dummyPhoneNumber) &&
      this.environment === Environment.DEVELOPMENT
    );
  }

  private isDummyOtpValidation(user: UserDto, receivedCode: string): boolean {
    const dummyCode = '555555';
    return this.isDummyOtpRequest(user) && receivedCode === dummyCode;
  }
}
