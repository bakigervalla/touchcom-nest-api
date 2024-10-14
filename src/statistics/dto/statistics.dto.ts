import { ApiProperty } from '@nestjs/swagger';

import { DeviceInfo } from './device-info.dto';

export class StatisticsDto {
  @ApiProperty()
  devicesInfo: DeviceInfo[];
  @ApiProperty()
  events: any[] = [];
  @ApiProperty()
  visitors: any[] = [];
}
