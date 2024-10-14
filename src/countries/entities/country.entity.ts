import { ApiProperty } from '@nestjs/swagger';
import { Country } from '@prisma/client';

import { BaseEntity } from '@common/entities';

export class CountryEntity extends BaseEntity implements Country {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  isoAlphaCode: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
