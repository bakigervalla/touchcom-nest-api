/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';
import { AccessTimeService } from '@access-times/access-time.service';

import { AccessGroupService } from '../access-group.service';

describe('Access Group Service', () => {
  let accessGroupService: AccessGroupService;
  let prisma: DeepMockProxy<PrismaClient>;
  let accessTimeService: DeepMockProxy<AccessTimeService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessGroupService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: AccessTimeService, useValue: mockDeep<AccessTimeService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    accessGroupService = module.get(AccessTimeService);
    accessTimeService = module.get<AccessGroupService>(AccessGroupService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(accessTimeService).toBeDefined();
    expect(accessGroupService).toBeDefined();
  });
});
