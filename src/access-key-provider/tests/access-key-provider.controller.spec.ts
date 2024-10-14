import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';

import { AccessKeyProviderController } from '../access-key-provider.controller';
import { AccessKeyProviderService } from '../access-key-provider.service';

describe('Access Key Provider Controller', () => {
  let accessKeyProviderController: AccessKeyProviderController;
  let accessKeyProviderService: AccessKeyProviderService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AccessKeyProviderController],
      providers: [
        {
          provide: AccessKeyProviderService,
          useValue: mockDeep<AccessKeyProviderService>(),
        },
      ],
    }).compile();

    accessKeyProviderController = module.get<AccessKeyProviderController>(
      AccessKeyProviderController,
    );
    accessKeyProviderService = module.get<AccessKeyProviderService>(
      AccessKeyProviderService,
    );
  });

  it('should be defined', () => {
    expect(accessKeyProviderController).toBeDefined();
    expect(accessKeyProviderService).toBeDefined();
  });
});
