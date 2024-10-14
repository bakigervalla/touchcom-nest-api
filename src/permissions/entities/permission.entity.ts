import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Permission, PermissionType } from '@prisma/client';

import { BaseEntity } from '@common/entities/base.entity';

export class PermissionEntity extends BaseEntity implements Permission {
  @ApiProperty()
  id: number;
  @ApiProperty()
  key: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsEnum(PermissionType)
  type: PermissionType;
  @IsOptional()
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
