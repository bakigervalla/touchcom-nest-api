/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { ConfigService } from '@nestjs/config';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { GoogleStorageService } from '@~google-cloud/google-storage.service';
import { PasswordService } from '@auth/password.service';
import { PrismaService } from '@~prisma/prisma.service';
import { SiteService } from '@sites/site.service';
import { TwilioService } from '@twilio/twilio.service';

import { UsersService } from '../users.service';

describe('Users Service', () => {
  let userService: UsersService;
  let prisma: DeepMockProxy<PrismaClient>;
  let config: DeepMockProxy<ConfigService>;
  let siteService: DeepMockProxy<SiteService>;
  let twilioService: DeepMockProxy<TwilioService>;
  let passwordService: DeepMockProxy<PasswordService>;
  let googleStorageService: DeepMockProxy<GoogleStorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: SiteService, useValue: mockDeep<SiteService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: TwilioService, useValue: mockDeep<TwilioService>() },
        { provide: ConfigService, useValue: mockDeep<ConfigService>() },
        { provide: PasswordService, useValue: mockDeep<PasswordService>() },
        {
          provide: GoogleStorageService,
          useValue: mockDeep<GoogleStorageService>(),
        },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    config = module.get(ConfigService);
    siteService = module.get(SiteService);
    twilioService = module.get(TwilioService);
    passwordService = module.get(PasswordService);
    userService = module.get<UsersService>(UsersService);
    googleStorageService = module.get(GoogleStorageService);

    config.get.mockResolvedValue({
      JWT_REFRESH_SECRET: 'jwt-refresh-secret',
      security: { refreshIn: '7d', bcryptSaltOrRound: 10 },
      googleCloud: {
        bucketName: 'touchcom-development',
      },
    });
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(config).toBeDefined();
    expect(siteService).toBeDefined();
    expect(userService).toBeDefined();
    expect(twilioService).toBeDefined();
    expect(passwordService).toBeDefined();
    expect(googleStorageService).toBeDefined();
  });
});
