import { PartialType } from '@nestjs/swagger';

import { RoleEntity } from '../entities';

export class RoleDto extends PartialType(RoleEntity) {}
