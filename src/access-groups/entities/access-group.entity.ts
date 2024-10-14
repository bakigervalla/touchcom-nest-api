import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AccessGroup, AccessGroupStatus } from '@prisma/client';

import { BaseEntity } from '@common/entities';

export class AccessGroupEntity extends BaseEntity implements AccessGroup {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
  @ApiProperty()
  @IsEnum(AccessGroupStatus)
  status: AccessGroupStatus;
  @ApiProperty()
  siteId: number;
  @ApiProperty()
  accessTimeScheduleId: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
