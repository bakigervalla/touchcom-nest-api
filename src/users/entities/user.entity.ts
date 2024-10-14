import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Address, User, UserStatus, UserType } from '@prisma/client';

import { BaseEntity } from '@common/entities/base.entity';

export class UserEntity extends BaseEntity implements User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  fcmToken: string | null;
  @ApiProperty()
  verificationCode: string;
  @ApiProperty()
  verificationCodeExpiration: Date | null;
  @ApiProperty()
  otpRequestCooldownExpiration: Date | null;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  floor: number;
  @ApiProperty()
  number: string;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  @IsEnum(UserStatus)
  status: UserStatus;
  @ApiProperty()
  @IsEnum(UserType)
  type: UserType;
  @ApiProperty()
  roleId: number;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  addressId: number;
  @ApiProperty()
  companyId: number;
  @ApiProperty()
  apartmentId: number;
}
