import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AccessControl, AccessKey, UserSite, UserStatus } from '@prisma/client';

import { AccessGroupDto } from '@access-groups/dto';
import { DeviceDto } from '@devices/dto';

import { IsPhoneNumber } from '@common/decorators/phone-number.decorator';
import { StrongPasswordOptions } from '@common/utils/constants';

import { UserEntity } from '../entities';

interface UserAccessControl {
  device: Partial<DeviceDto>;
  accessGroup: Partial<AccessGroupDto>;
  accessKey: Partial<AccessKey>;
}

export class CreateUserDto extends PartialType(UserEntity) {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  @MaxLength(40)
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(25)
  @IsStrongPassword(StrongPasswordOptions)
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  verificationCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty({ required: false, nullable: true })
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(25)
  @ApiProperty({ required: false, nullable: true })
  lastName?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(25)
  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty({ required: true })
  phone?: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ required: false, nullable: true })
  imageUrl?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  status?: UserStatus;

  @ApiProperty({ required: true })
  roleId: number;

  @IsOptional()
  companyId?: number;

  @IsOptional()
  @ApiProperty()
  accessControls?: AccessControl[];

  @IsOptional()
  @ApiProperty()
  accessControl?: UserAccessControl;

  @IsOptional()
  @ApiProperty()
  sites?: UserSite[];
}
