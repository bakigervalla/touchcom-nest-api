import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@~prisma/prisma.service';

import { CountriesService } from '../countries.service';

describe('Countries Service', () => {
  let countriesService: CountriesService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    prisma = module.get(PrismaService);
    countriesService = module.get<CountriesService>(CountriesService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(countriesService).toBeDefined();
  });
});
