import { Type } from 'class-transformer';

import { Pagination } from '@common/entities';

import { SiteDto } from './site.dto';

export class PaginatedSitesDto extends Pagination<SiteDto> {
  @Type(() => SiteDto)
  data: SiteDto[];
}
