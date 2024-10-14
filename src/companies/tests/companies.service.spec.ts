import { Test, TestingModule } from '@nestjs/testing';

import { CompaniesService } from '../companies.service';

describe('Companies Service', () => {
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService],
    }).compile();

    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(companiesService).toBeDefined();
  });
});
