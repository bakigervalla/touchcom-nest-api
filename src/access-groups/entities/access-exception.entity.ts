import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  AccessException,
  AccessExceptionStatus,
  LockStatus,
} from '@prisma/client';

import { BaseEntity } from '@common/entities';

export class AccessExceptionEntity
  extends BaseEntity
  implements AccessException
{
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsEnum(LockStatus)
  lockStatus: LockStatus;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  endTime: string;
  @ApiProperty()
  applySingleDate: boolean;
  @ApiProperty()
  applyWholeDay: boolean;
  @ApiProperty()
  applyForNextYear: boolean;
  @ApiProperty()
  @IsEnum(AccessExceptionStatus)
  status: AccessExceptionStatus;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
