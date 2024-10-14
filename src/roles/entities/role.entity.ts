import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

import { BaseEntity } from '@common/entities/base.entity';

export class RoleEntity extends BaseEntity implements Role {
  @ApiProperty()
  id: number;
  @ApiProperty()
  key: string;
  @ApiProperty()
  name: string;
  @IsOptional()
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
