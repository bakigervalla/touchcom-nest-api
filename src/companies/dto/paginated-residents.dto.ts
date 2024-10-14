import { PartialType } from '@nestjs/swagger';

import { PaginatedUsersDto } from '@users/dto';

export class PaginatedResidentsDto extends PartialType(PaginatedUsersDto) {}
