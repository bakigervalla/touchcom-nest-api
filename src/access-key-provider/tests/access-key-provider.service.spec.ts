/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { AccessKeyProviderService } from '../access-key-provider.service';

describe('Access Key Provider Service', () => {
  let accessKeyProviderService: AccessKeyProviderService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessKeyProviderService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    accessKeyProviderService = module.get<AccessKeyProviderService>(
      AccessKeyProviderService,
    );
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(accessKeyProviderService).toBeDefined();
  });
});
