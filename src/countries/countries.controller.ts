import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { PrismaClientExceptionFilter } from '@~prisma/client-exception';

import { JwtAuthGuard } from '@auth/strategy/jwt-auth.guard';

import { CountriesService } from './countries.service';
import { CountryDto } from './dto';

@Controller('countries')
@ApiTags('Countries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @SkipThrottle()
  @ApiCreatedResponse({ type: CountryDto })
  async getCountries(): Promise<CountryDto[]> {
    return this.countriesService.getCountries();
  }
}
