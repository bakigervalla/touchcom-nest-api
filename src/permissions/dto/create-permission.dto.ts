import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PermissionType, RolePermission } from '@prisma/client';

import { PermissionEntity } from '../entities';

export class CreatePermissionDto extends PartialType(PermissionEntity) {
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

  @IsEnum(PermissionType)
  @ApiProperty()
  type: PermissionType;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  roles?: RolePermission[];
}
