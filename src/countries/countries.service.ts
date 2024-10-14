import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma/prisma.service';

import { CountryDto } from './dto';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  getCountries(): Promise<CountryDto[]> {
    return this.prisma.country.findMany();
  }
}
