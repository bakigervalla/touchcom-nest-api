import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AccessControl, AccessControlStatus } from '@prisma/client';

import { BaseEntity } from '@common/entities/base.entity';

export class AccessControlEntity extends BaseEntity implements AccessControl {
  @ApiProperty()
  id: number;
  @ApiProperty()
  failedAccessAttempts: number;
  @ApiProperty()
  accessFailedAt: Date | null;
  @ApiProperty()
  accessStartsAt: Date | null;
  @ApiProperty()
  accessEndsAt: Date | null;
  @ApiProperty()
  @IsEnum(AccessControlStatus)
  status: AccessControlStatus;
  @ApiProperty()
  isVisible: boolean;
  @ApiProperty()
  userId: number | null;
  @ApiProperty()
  deviceId: number | null;
  @ApiProperty()
  accessGroupId: number | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
