import { Type } from 'class-transformer';

import { UserDto } from '@users/dto';

export class UserSiteDto {
  @Type(() => UserDto)
  user: UserDto;
}
