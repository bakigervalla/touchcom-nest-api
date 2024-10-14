import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { AccessGroupDto } from '@access-groups/dto';
import { AccessKeyDto } from '@access-key/dto';
import { DeviceDto } from '@devices/dto';
import { UserDto } from '@users/dto';

import { AccessControlEntity } from '../entities';

export class AccessControlDto extends PartialType(AccessControlEntity) {
  @ApiProperty()
  @IsOptional()
  @Type(() => UserDto)
  user?: UserDto | null;
  @ApiProperty()
  @IsOptional()
  device?: DeviceDto | null;
  @ApiProperty()
  @IsOptional()
  accessGroup?: AccessGroupDto | null;
  @ApiProperty()
  @IsOptional()
  @Type(() => AccessKeyDto)
  accessKey?: AccessKeyDto | null;
}
