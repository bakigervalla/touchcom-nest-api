import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

import { Token } from '../entities';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  @MaxLength(40)
  @ApiProperty({ required: true })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly password: string;
}

export class LoginDeviceDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly serialNumber: string;
}

export class LoginDeviceResponseDto extends Token {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly deviceId: number;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly inReview: boolean;
}
