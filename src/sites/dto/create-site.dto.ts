import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SiteStatus } from '@prisma/client';

import { SiteEntity } from '../entities';

export class CreateSiteDto extends PartialType(SiteEntity) {
  @ApiProperty()
  name: string | null;
  @ApiProperty()
  description: string | null;
  @ApiProperty()
  floor: number | null;
  @ApiProperty()
  @IsEnum(SiteStatus)
  status: SiteStatus;
  @ApiProperty()
  addressId: number;
}
