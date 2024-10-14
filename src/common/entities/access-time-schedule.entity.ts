import { ApiProperty } from '@nestjs/swagger';
import { AccessTimeSchedule } from '@prisma/client';

import { BaseEntity } from './base.entity';

export class AccessTimeScheduleEntity
  extends BaseEntity
  implements AccessTimeSchedule
{
  @ApiProperty()
  id: number;
  @ApiProperty()
  applyEveryDay: boolean;
  @ApiProperty()
  applyWholeMonday: boolean;
  @ApiProperty()
  applyWholeTuesday: boolean;
  @ApiProperty()
  applyWholeWednesday: boolean;
  @ApiProperty()
  applyWholeThursday: boolean;
  @ApiProperty()
  applyWholeFriday: boolean;
  @ApiProperty()
  applyWholeSaturday: boolean;
  @ApiProperty()
  applyWholeSunday: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
