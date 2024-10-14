import { Type } from 'class-transformer';

import { Pagination } from '@common/entities';

import { AccessControlDto } from './access-control.dto';

export class PaginatedAccessControlsDto extends Pagination<AccessControlDto> {
  @Type(() => AccessControlDto)
  data: AccessControlDto[];
}
