import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { PermissionController } from '../permission.controller';
import { PermissionService } from '../permission.service';

describe('Permission Controller', () => {
  let permissionController: PermissionController;
  let permissionService: DeepMockProxy<PermissionService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [PermissionController],
      providers: [
        { provide: PermissionService, useValue: mockDeep<PermissionService>() },
      ],
    }).compile();

    permissionService = module.get(PermissionService);
    permissionController =
      module.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(permissionService).toBeDefined();
    expect(permissionController).toBeDefined();
  });
});
