/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { ConfigService } from '@nestjs/config';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { token, user } from '@mocks';

import { AccessControlService } from '@access-control/access-control.service';
import { DevicesService } from '@devices/devices.service';
import { PrismaService } from '@~prisma/prisma.service';
import { RoleService } from '@roles/role.service';
import { TwilioService } from '@twilio/twilio.service';

import { AuthService } from '../auth.service';
import { PasswordService } from '../password.service';

describe('Auth Service', () => {
  let authService: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;
  let config: DeepMockProxy<ConfigService>;
  let jwtService: DeepMockProxy<JwtService>;
  let roleService: DeepMockProxy<RoleService>;
  let twilioService: DeepMockProxy<TwilioService>;
  let deviceService: DeepMockProxy<DevicesService>;
  let passwordService: DeepMockProxy<PasswordService>;
  let accessControlService: DeepMockProxy<AccessControlService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockDeep<JwtService>() },
        { provide: RoleService, useValue: mockDeep<RoleService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: ConfigService, useValue: mockDeep<ConfigService>() },
        { provide: TwilioService, useValue: mockDeep<TwilioService>() },
        { provide: DevicesService, useValue: mockDeep<DevicesService>() },
        { provide: PasswordService, useValue: mockDeep<PasswordService>() },
        {
          provide: AccessControlService,
          useValue: mockDeep<AccessControlService>(),
        },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    config = module.get(ConfigService);
    jwtService = module.get(JwtService);
    roleService = module.get(RoleService);
    twilioService = module.get(TwilioService);
    deviceService = module.get(DevicesService);
    passwordService = module.get(PasswordService);
    authService = module.get<AuthService>(AuthService);
    accessControlService = module.get(AccessControlService);

    config.get.mockResolvedValue({
      JWT_REFRESH_SECRET: 'jwt-refresh-secret',
      security: { refreshIn: '7d', bcryptSaltOrRound: 10 },
      twilio: {
        accountSid: 'accountSid',
        apiKey: 'apiKey',
        apiKeySecret: 'apiKeySecret',
        pushCredentialSid: 'pushCredentialSid',
        outgoingApplicationSid: 'outgoingApplicationSid',
        verifySid: 'verifySid',
        authToken: 'authToken',
        forgotPasswordSid: 'forgotPasswordSid',
        resetPasswordSid: 'resetPasswordSid',
      },
    });
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(config).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(roleService).toBeDefined();
    expect(authService).toBeDefined();
    expect(twilioService).toBeDefined();
    expect(deviceService).toBeDefined();
    expect(passwordService).toBeDefined();
    expect(accessControlService).toBeDefined();
  });

  it('should login successfully', () => {
    passwordService.validatePassword.mockResolvedValue(true);
    prisma.user.findUnique.mockResolvedValue(user.activeTestUser);
    jwtService.sign.mockReturnValue(token.testTokens.accessToken);

    expect(
      authService.login({
        email: 'company@touchcom.com',
        password: 'company',
      }),
    ).resolves.toStrictEqual({
      accessToken: token.testTokens.accessToken,
      refreshToken: token.testTokens.accessToken,
    });
  });

  it('should refresh access token successfully', () => {
    jwtService.sign.mockReturnValue(token.testTokens.accessToken);
    jwtService.verify.mockReturnValue({ email: 'dummy@touchcom.com' });

    expect(
      authService.refreshToken({
        token: token.testTokens.refreshToken,
      }),
    ).resolves.toStrictEqual({
      accessToken: token.testTokens.accessToken,
      refreshToken: token.testTokens.accessToken,
    });
  });
});
