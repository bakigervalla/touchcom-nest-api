import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Site, SiteStatus } from '@prisma/client';

import { BaseEntity } from '@common/entities/base.entity';

export class SiteEntity extends BaseEntity implements Site {
  @ApiProperty()
  id: number;
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
  imageUrl: string;
  @ApiProperty()
  addressId: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
