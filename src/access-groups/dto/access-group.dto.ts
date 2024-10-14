import { PartialType } from '@nestjs/swagger';

import { AccessControlDto } from '@access-control/dto';
import { AccessTimeScheduleDto } from '@common/dto';

import { AccessGroupEntity } from '../entities';

import { AccessGroupAccessExceptionDto } from './exception.dto';

export class AccessGroupDto extends PartialType(AccessGroupEntity) {
  totalDevices?: number;
  totalUsers?: number;
  accessControls?: AccessControlDto[];
  accessTimeSchedule?: AccessTimeScheduleDto;
  accessExceptions?: AccessGroupAccessExceptionDto[];
}
