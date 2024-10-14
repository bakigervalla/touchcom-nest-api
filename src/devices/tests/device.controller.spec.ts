import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { DevicesController } from '../devices.controller';
import { DevicesService } from '../devices.service';

describe('Device Controller', () => {
  let deviceController: DevicesController;
  let deviceService: DevicesService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [DevicesController],
      providers: [
        { provide: DevicesService, useValue: mockDeep<DevicesService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    deviceService = module.get<DevicesService>(DevicesService);
    deviceController = module.get<DevicesController>(DevicesController);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(deviceService).toBeDefined();
    expect(deviceController).toBeDefined();
  });
});
