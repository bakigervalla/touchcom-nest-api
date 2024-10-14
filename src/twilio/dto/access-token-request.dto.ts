import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenRequestDto {
  @ApiProperty()
  deviceId: number;
}
