import { Address, Country } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { SiteEntity } from '../entities';

import { UserSiteDto } from './user-site.dto';

export class SiteDto extends PartialType(SiteEntity) {
  @Type(() => UserSiteDto)
  users?: UserSiteDto[];
  addressId?: number;
  address?: Address & {
    country?: Country;
  };
}
