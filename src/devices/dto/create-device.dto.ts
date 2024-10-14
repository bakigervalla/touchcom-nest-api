import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DeviceStatus, AccessControl, Version } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ConfigurationDto } from '@configurations/dto';
import { SiteDto } from '@sites/dto';
import { UserDto } from '@users/dto';

import { DeviceEntity } from '../entities';

export class CreateDeviceDto extends PartialType(DeviceEntity) {
  @IsString()
  @ApiProperty()
  serialNumber: string = randomUUID();

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(40)
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  imageUrl?: string;

  @IsEnum(DeviceStatus)
  @IsOptional()
  @ApiProperty()
  status: DeviceStatus;

  @ApiProperty()
  configurationId: number;

  @ApiProperty()
  configuration: ConfigurationDto;

  @ApiProperty()
  versionId: number;

  @ApiProperty()
  version: Version;

  @IsOptional()
  @ApiProperty()
  siteId: number;

  @IsOptional()
  @ApiProperty()
  site?: SiteDto;

  @IsOptional()
  @ApiProperty()
  credentials?: Pick<UserDto, 'email' | 'password'>;

  @IsOptional()
  @ApiProperty()
  accessControls?: AccessControl[];
}
