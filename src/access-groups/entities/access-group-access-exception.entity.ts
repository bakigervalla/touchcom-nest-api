import { ApiProperty } from '@nestjs/swagger';
import { AccessGroupAccessException } from '@prisma/client';

import { BaseEntity } from '@common/entities';

export class AccessGroupAccessExceptionEntity
  extends BaseEntity
  implements AccessGroupAccessException
{
  @ApiProperty()
  id: number;
  @ApiProperty()
  accessGroupId: number;
  @ApiProperty()
  accessExceptionId: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
