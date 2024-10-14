import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';

import { ConfigurationController } from '../configuration.controller';
import { ConfigurationService } from '../configuration.service';

describe('Configuration Controller', () => {
  let configurationController: ConfigurationController;
  let configurationService: ConfigurationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ConfigurationController],
      providers: [
        {
          provide: ConfigurationService,
          useValue: mockDeep<ConfigurationService>(),
        },
      ],
    }).compile();

    configurationController = module.get<ConfigurationController>(
      ConfigurationController,
    );
    configurationService =
      module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(configurationController).toBeDefined();
    expect(configurationService).toBeDefined();
  });
});
