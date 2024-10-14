import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { CountriesController } from '../countries.controller';
import { CountriesService } from '../countries.service';

describe('Countries Controller', () => {
  let controller: CountriesController;
  let service: DeepMockProxy<CountriesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        { provide: CountriesService, useValue: mockDeep<CountriesService>() },
      ],
    }).compile();

    service = module.get(CountriesService);
    controller = module.get<CountriesController>(CountriesController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
