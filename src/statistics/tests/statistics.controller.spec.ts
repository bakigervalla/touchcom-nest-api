import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { StatisticsController } from '../statistics.controller';
import { StatisticsService } from '../statistics.service';

describe('Statistics Controller', () => {
  let controller: StatisticsController;
  let service: DeepMockProxy<StatisticsService>;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: StatisticsService, useValue: mockDeep<StatisticsService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    service = module.get(StatisticsService);
    controller = module.get<StatisticsController>(StatisticsController);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
