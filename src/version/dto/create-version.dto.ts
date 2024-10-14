import { ApiProperty, PartialType } from '@nestjs/swagger';

import { VersionEntity } from '../entities';

export class CreateVersionDto extends PartialType(VersionEntity) {
  @ApiProperty()
  id: number;
  @ApiProperty()
  version: string;
  @ApiProperty()
  file: Buffer[];
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
