import { ApiProperty } from '@nestjs/swagger';
import { AccessKeyProvider } from '@prisma/client';

import { BaseEntity } from '@common/entities';

export class AccessKeyProviderEntity
  extends BaseEntity
  implements AccessKeyProvider
{
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
