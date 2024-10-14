import { PartialType } from '@nestjs/swagger';

import { PermissionEntity } from '../entities';

export class PermissionDto extends PartialType(PermissionEntity) {}
