import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { UserDto } from '@users/dto';

import { DeviceDto } from './device.dto';

export class DeviceRegistrationVerificationDto {
  @ApiProperty({ required: true })
  user: UserDto;

  @ApiProperty({ required: true })
  device: DeviceDto;

  @IsBoolean()
  @ApiProperty({ required: true })
  isApproved: boolean;
}
