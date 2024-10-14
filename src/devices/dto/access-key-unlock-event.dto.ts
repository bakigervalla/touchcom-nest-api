import { ApiProperty } from '@nestjs/swagger';

export class AccessKeyUnlockEvent {
  @ApiProperty()
  timestamp: number;
  @ApiProperty()
  isPinCodeUsed: boolean;
  @ApiProperty()
  tag: string;
  @ApiProperty()
  userId: number;
}
