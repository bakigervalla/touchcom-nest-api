import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { AccessGroupController } from '../access-group.controller';
import { AccessGroupService } from '../access-group.service';

describe('Access Group Controller', () => {
  let accessGroupService: AccessGroupService;
  let accessGroupController: AccessGroupController;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AccessGroupController],
      providers: [
        {
          provide: AccessGroupService,
          useValue: mockDeep<AccessGroupService>(),
        },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    accessGroupController = module.get<AccessGroupController>(
      AccessGroupController,
    );
    accessGroupService = module.get<AccessGroupService>(AccessGroupService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(accessGroupService).toBeDefined();
    expect(accessGroupController).toBeDefined();
  });
});
