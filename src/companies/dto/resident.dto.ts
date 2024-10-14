import { PartialType } from '@nestjs/swagger';

import { UserDto } from '@users/dto';

export class ResidentDto extends PartialType(UserDto) {}
