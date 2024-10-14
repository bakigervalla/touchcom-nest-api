import {
  IsNotEmpty,
  IsStrongPassword,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { StrongPasswordOptions } from '@common/utils/constants';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(25)
  @IsStrongPassword(StrongPasswordOptions)
  @ApiProperty({ required: true })
  readonly newPassword: string;
}
