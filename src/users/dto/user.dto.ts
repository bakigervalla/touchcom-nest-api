import { Exclude, Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { AccessControl, AccessKey, UserSite } from '@prisma/client';

import { AccessGroupDto } from '@access-groups/dto';
import { DeviceDto } from '@devices/dto';
import { PermissionDto } from '@permissions/dto';
import { RoleDto } from '@roles/dto';
import { SiteDto } from '@sites/dto';

import { UserEntity } from '../entities';

interface UserAccessControl {
  device: Partial<DeviceDto>;
  accessGroup: Partial<AccessGroupDto>;
  accessKey: Partial<AccessKey>;
}

export class UserDto extends PartialType(UserEntity) {
  @Exclude()
  password?: string;
  @Exclude()
  fcmToken?: string;
  @Exclude()
  verificationCode?: string;
  accessControls?: (AccessControl & {
    device: DeviceDto;
    accessGroup: AccessGroupDto;
    accessKey: AccessKey;
  })[];
  activeSite?: SiteDto;
  sites?: UserSite[];
  role?: RoleDto & {
    permissions: { permission: PermissionDto }[];
  };
  @Type(() => UserDto)
  company?: UserDto[];
  accessControl?: UserAccessControl;
}
