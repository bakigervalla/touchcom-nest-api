import { AccessTime, TimeScheduleAccessTime } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

import { AccessTimeScheduleEntity } from '../entities';

export class AccessTimeScheduleDto extends PartialType(
  AccessTimeScheduleEntity,
) {
  accessTimes?: Partial<TimeScheduleAccessTime & { accessTime: AccessTime }>[];
}
