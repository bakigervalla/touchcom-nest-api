import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { DeviceEvent } from '@common/types';

export class EventTrigger {
  @IsNumber()
  @ApiProperty({ required: true })
  deviceId: number;

  @IsEnum(DeviceEvent)
  @ApiProperty()
  event: DeviceEvent;

  @IsOptional()
  @ApiProperty()
  options?: any = {};
}
