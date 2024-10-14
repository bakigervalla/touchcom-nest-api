import { Type } from 'class-transformer';

import { Pagination } from '@common/entities';

import { VersionDto } from './version.dto';

export class PaginatedVersionsDto extends Pagination<VersionDto> {
  @Type(() => VersionDto)
  data: VersionDto[];
}
