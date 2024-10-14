import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AccessKey } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AccessKeyProviderEntity } from '../entities';

export class CreateAccessKeyProviderDto extends PartialType(
  AccessKeyProviderEntity,
) {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(80)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  @MaxLength(40)
  @ApiProperty({ required: true })
  email: string;

  @IsOptional()
  @ApiProperty()
  accessKeys?: AccessKey[];
}
