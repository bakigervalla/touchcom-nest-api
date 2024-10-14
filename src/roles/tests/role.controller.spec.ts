import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { RoleController } from '../role.controller';
import { RoleService } from '../role.service';

describe('Role Controller', () => {
  let roleController: RoleController;
  let roleService: DeepMockProxy<RoleService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [RoleController],
      providers: [{ provide: RoleService, useValue: mockDeep<RoleService>() }],
    }).compile();

    roleService = module.get(RoleService);
    roleController = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
    expect(roleController).toBeDefined();
  });
});
