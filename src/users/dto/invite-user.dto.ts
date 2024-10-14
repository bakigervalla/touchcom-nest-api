import {
  IsNotEmpty,
  IsStrongPassword,
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { StrongPasswordOptions } from '@common/utils/constants';

export class ResendUserInvitationDto {
  @ApiProperty()
  @Type(() => String)
  @IsEmail()
  @IsString()
  email: string;
}

export class InviteUserDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  firstName: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  lastName: string;

  @ApiProperty()
  @Type(() => String)
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty()
  roleId: number;
}

export class AcceptInvitationDto {
  @IsString()
  @MinLength(6)
  @MaxLength(25)
  @IsStrongPassword(StrongPasswordOptions)
  @ApiProperty({ required: true })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  invitationToken: string;
}
