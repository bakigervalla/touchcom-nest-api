import { ApiProperty } from '@nestjs/swagger';

export class VerificationStatusDto {
  @ApiProperty()
  status: string;
}
