/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { PermissionService } from '../permission.service';

describe('Permission Service', () => {
  let permissionService: PermissionService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(permissionService).toBeDefined();
  });
});
