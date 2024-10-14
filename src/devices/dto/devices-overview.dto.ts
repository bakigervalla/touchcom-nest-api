import { ApiProperty } from '@nestjs/swagger';

export class DevicesOverviewDto {
  @ApiProperty()
  totalDevices: number;
  @ApiProperty()
  visitorPanels: number;
  @ApiProperty()
  doors: number;
}
