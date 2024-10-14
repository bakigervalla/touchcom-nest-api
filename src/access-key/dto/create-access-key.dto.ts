import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  AccessControl,
  AccessKeyProvider,
  AccessKeyStatus,
} from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { AccessKeyEntity } from '../entities';

export class CreateAccessKeyDto extends PartialType(AccessKeyEntity) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  pin?: string;

  @IsOptional()
  @IsEnum(AccessKeyStatus)
  @ApiProperty()
  status?: AccessKeyStatus;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  consumption?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ nullable: true })
  accessStartsAt?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ nullable: true })
  accessEndsAt?: Date;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  failedAccessAttempts?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ nullable: true })
  accessFailedAt?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @ApiProperty()
  accessControl: AccessControl;

  @ApiProperty()
  accessKeyProvider: AccessKeyProvider;
}
