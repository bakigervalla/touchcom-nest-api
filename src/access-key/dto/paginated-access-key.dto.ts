import { Type } from 'class-transformer';

import { Pagination } from '@common/entities';

import { AccessKeyDto } from './access-key.dto';

export class PaginatedAccessKeysDto extends Pagination<AccessKeyDto> {
  @Type(() => AccessKeyDto)
  data: AccessKeyDto[];
}
