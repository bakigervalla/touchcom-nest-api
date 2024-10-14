/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { ConfigService } from '@nestjs/config';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { AccessControlService } from '@access-control/access-control.service';
import { ConfigurationService } from '@configurations/configuration.service';
import { GoogleStorageService } from '@~google-cloud/google-storage.service';
import { PrismaService } from '@~prisma/prisma.service';
import { RoleService } from '@roles/role.service';
import { UsersService } from '@users/users.service';
import { VersionService } from '@version/version.service';

import { DevicesService } from '../devices.service';

describe('Device Service', () => {
  let deviceService: DevicesService;
  let prisma: DeepMockProxy<PrismaClient>;
  let config: DeepMockProxy<ConfigService>;
  let roleService: DeepMockProxy<RoleService>;
  let userService: DeepMockProxy<UsersService>;
  let versionService: DeepMockProxy<VersionService>;
  let configurationService: DeepMockProxy<ConfigurationService>;
  let accessControlService: DeepMockProxy<AccessControlService>;
  let googleStorageService: DeepMockProxy<GoogleStorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        DevicesService,
        { provide: RoleService, useValue: mockDeep<RoleService>() },
        { provide: UsersService, useValue: mockDeep<UsersService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: ConfigService, useValue: mockDeep<ConfigService>() },
        { provide: VersionService, useValue: mockDeep<VersionService>() },
        { provide: 'DEVICE_SERVICE', useValue: mockDeep<'DEVICE_SERVICE'>() },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockDeep<WINSTON_MODULE_PROVIDER>(),
        },
        {
          provide: ConfigurationService,
          useValue: mockDeep<ConfigurationService>(),
        },
        {
          provide: AccessControlService,
          useValue: mockDeep<AccessControlService>(),
        },
        {
          provide: GoogleStorageService,
          useValue: mockDeep<GoogleStorageService>(),
        },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    config = module.get(ConfigService);
    roleService = module.get(RoleService);
    userService = module.get(UsersService);
    versionService = module.get(VersionService);
    accessControlService = module.get(AccessControlService);
    configurationService = module.get(ConfigurationService);
    googleStorageService = module.get(GoogleStorageService);
    deviceService = module.get<DevicesService>(DevicesService);

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
    expect(roleService).toBeDefined();
    expect(userService).toBeDefined();
    expect(deviceService).toBeDefined();
    expect(versionService).toBeDefined();
    expect(configurationService).toBeDefined();
    expect(accessControlService).toBeDefined();
    expect(googleStorageService).toBeDefined();
  });
});
