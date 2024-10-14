import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

import { OtpChannel } from '@common/types';

export const OTP_REQUEST_COOLDOWN_TIME = 180;

export class OtpRequestDto {
  @ApiProperty()
  otpRequestCooldownExpiration: Date;
}

export class LoginOtpDto {
  @IsString()
  @ApiProperty({ required: true })
  input: string;

  @ApiProperty({ required: true })
  @IsEnum(OtpChannel)
  channel: OtpChannel;
}

export class LoginOtpVerificationDto extends LoginOtpDto {
  @ApiProperty({ required: true })
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
