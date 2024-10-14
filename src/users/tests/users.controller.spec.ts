import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@~prisma/prisma.service';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('Users Controller', () => {
  let controller: UsersController;
  let prisma: DeepMockProxy<PrismaClient>;
  let service: DeepMockProxy<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockDeep<UsersService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    service = module.get(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
