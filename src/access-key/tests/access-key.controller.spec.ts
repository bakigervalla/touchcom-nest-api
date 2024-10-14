import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { AccessKeyController } from '../access-key.controller';
import { AccessKeyService } from '../access-key.service';

describe('Access Key Controller', () => {
  let accessKeyService: AccessKeyService;
  let accessKeyController: AccessKeyController;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AccessKeyController],
      providers: [
        {
          provide: AccessKeyService,
          useValue: mockDeep<AccessKeyService>(),
        },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    accessKeyController = module.get<AccessKeyController>(AccessKeyController);
    accessKeyService = module.get<AccessKeyService>(AccessKeyService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(accessKeyService).toBeDefined();
    expect(accessKeyController).toBeDefined();
  });
});
