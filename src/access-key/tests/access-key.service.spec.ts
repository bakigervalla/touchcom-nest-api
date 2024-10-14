/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { AccessKeyProviderService } from '@access-key-provider/access-key-provider.service';
import { AccessTimeService } from '@access-times/access-time.service';
import { PrismaService } from '@~prisma/prisma.service';

import { AccessKeyService } from '../access-key.service';

describe('Access Key Service', () => {
  let accessKeyService: AccessKeyService;
  let prisma: DeepMockProxy<PrismaClient>;
  let accessTimeService: DeepMockProxy<AccessTimeService>;
  let accessKeyProviderService: DeepMockProxy<AccessKeyProviderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessKeyService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: AccessTimeService, useValue: mockDeep<AccessTimeService>() },
        {
          provide: AccessKeyProviderService,
          useValue: mockDeep<AccessKeyProviderService>(),
        },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    accessTimeService = module.get(AccessTimeService);
    accessKeyProviderService = module.get(AccessKeyProviderService);
    accessKeyService = module.get<AccessKeyService>(AccessKeyService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(accessKeyService).toBeDefined();
    expect(accessTimeService).toBeDefined();
    expect(accessKeyProviderService).toBeDefined();
  });
});
