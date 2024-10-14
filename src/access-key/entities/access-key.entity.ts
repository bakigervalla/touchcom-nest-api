import { ApiProperty } from '@nestjs/swagger';
import {
  AccessControl,
  AccessKey,
  AccessKeyProvider,
  AccessKeyStatus,
  AccessKeyType,
  AccessTimeSchedule,
} from '@prisma/client';

import { BaseEntity } from '@common/entities';
import { IsEnum } from 'class-validator';

export class AccessKeyEntity extends BaseEntity implements AccessKey {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tag: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  pin: string;

  @ApiProperty()
  @IsEnum(AccessKeyType)
  type: AccessKeyType;

  @ApiProperty()
  @IsEnum(AccessKeyStatus)
  status: AccessKeyStatus;

  @ApiProperty()
  consumption: number;

  @ApiProperty({ required: false, nullable: true })
  validFrom: Date | null;

  @ApiProperty({ required: false, nullable: true })
  validTo: Date | null;

  @ApiProperty()
  failedAccessAttempts: number;

  @ApiProperty({ required: false, nullable: true })
  accessFailedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  siteId: number;

  @ApiProperty()
  accessControlId: number;

  @ApiProperty()
  accessControl: AccessControl;

  @ApiProperty()
  accessKeyProviderId: number;

  @ApiProperty()
  accessKeyProvider: AccessKeyProvider;

  @ApiProperty()
  accessTimeScheduleId: number;

  @ApiProperty()
  accessTimeSchedule: AccessTimeSchedule;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
