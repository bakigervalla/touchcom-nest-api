/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { ConfigurationService } from '../configuration.service';

describe('Configuration Service', () => {
  let configurationService: ConfigurationService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    configurationService =
      module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(configurationService).toBeDefined();
  });
});
