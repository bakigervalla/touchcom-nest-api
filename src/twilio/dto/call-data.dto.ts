import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsEmail } from 'class-validator';

export class CallDataDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string = null;
  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty({ required: false })
  phone?: string = null;
  @ApiProperty()
  @Transform((data) => parseInt(data.value, 10))
  deviceId: number;
  @ApiProperty()
  CallSid: string;
}
