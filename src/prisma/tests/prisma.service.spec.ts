/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { device } from '@mocks';

import { PrismaService } from '../prisma.service';

describe('PrismaService', () => {
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  it('should return data related to the entity', () => {
    prisma.device.findMany.mockResolvedValue(device.testDevices);

    expect(prisma.device.findMany()).resolves.toBe(device.testDevices);
  });

  it('should return paginated data related to the entity', () => {
    const paginatedDevices = device.testDevices.slice(1);

    prisma.device.findMany.mockResolvedValue(paginatedDevices);

    expect(prisma.device.findMany({ skip: 1 })).resolves.toBe(paginatedDevices);
  });
});
