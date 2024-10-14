import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { AccessControlDto } from '@access-control/dto';
import { ConfigurationDto } from '@configurations/dto';
import { SiteDto } from '@sites/dto';
import { UserDto } from '@users/dto';
import { VersionDto } from '@version/dto';

import { DeviceEntity } from '../entities';

export class DeviceDto extends PartialType(DeviceEntity) {
  @ApiProperty()
  @Type(() => AccessControlDto)
  connectedUser?: UserDto;
  accessControls?: AccessControlDto[];
  configuration?: ConfigurationDto;
  site?: SiteDto;
  version?: VersionDto;
}
