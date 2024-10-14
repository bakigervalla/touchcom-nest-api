import { ApiProperty } from '@nestjs/swagger';
import { Version } from '@prisma/client';

import { BaseEntity } from '@common/entities/base.entity';

export class VersionEntity extends BaseEntity implements Version {
  @ApiProperty()
  id: number;
  @ApiProperty()
  tag: string;
  @ApiProperty()
  fileUrl: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
