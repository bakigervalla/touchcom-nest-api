import { Type } from 'class-transformer';

import { Pagination } from '@common/entities';

import { UserDto } from './user.dto';

export class PaginatedUsersDto extends Pagination<UserDto> {
  @Type(() => UserDto)
  data: UserDto[];
}
