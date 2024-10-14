import {
  IsNotEmpty,
  IsStrongPassword,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { StrongPasswordOptions } from '@common/utils/constants';

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(25)
  @IsStrongPassword(StrongPasswordOptions)
  @ApiProperty({ required: true })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  passwordResetToken: string;
}
