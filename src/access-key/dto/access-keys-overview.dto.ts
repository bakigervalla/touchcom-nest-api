import { ApiProperty } from '@nestjs/swagger';

export class AccessKeysOverviewDto {
  @ApiProperty()
  totalKeys: number;
  @ApiProperty()
  activeKeys: number;
  @ApiProperty()
  inactiveKeys: number;
}
