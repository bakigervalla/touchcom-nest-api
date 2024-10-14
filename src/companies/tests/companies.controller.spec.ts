import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { CompaniesController } from '../companies.controller';
import { CompaniesService } from '../companies.service';

describe('Companies Controller', () => {
  let controller: CompaniesController;
  let service: DeepMockProxy<CompaniesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        { provide: CompaniesService, useValue: mockDeep<CompaniesService>() },
      ],
    }).compile();

    service = module.get(CompaniesService);
    controller = module.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
