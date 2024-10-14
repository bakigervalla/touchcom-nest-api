import { ApiProperty } from '@nestjs/swagger';

export class SitesOverviewDto {
  @ApiProperty()
  totalSites: number;
  @ApiProperty()
  activeSites: number;
  @ApiProperty()
  inactiveSites: number;
}
