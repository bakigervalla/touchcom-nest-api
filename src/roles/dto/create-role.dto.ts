import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RolePermission } from '@prisma/client';

import { RoleEntity } from '../entities';
import { Permission } from '@src/common/types';

export class CreateRoleDto extends PartialType(RoleEntity) {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty()
  key: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(80)
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  permissions?: (RolePermission & { permission: Permission })[];
}
