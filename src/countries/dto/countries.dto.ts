import { PartialType } from '@nestjs/swagger';

import { CountryEntity } from '../entities';

export class CountryDto extends PartialType(CountryEntity) {}
