import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { StatisticsService } from '../statistics.service';

describe('Statistics Service', () => {
  let statisticsService: StatisticsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    statisticsService = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(statisticsService).toBeDefined();
  });
});
