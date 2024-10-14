import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { PageOptionsDto } from '@common/dto';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';

import { JwtAuthGuard } from '@auth/strategy/jwt-auth.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

import { CompaniesService } from './companies.service';
import { PaginatedResidentsDto } from './dto';

@Controller('companies')
@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
@UseInterceptors(new TransformInterceptor(PaginatedResidentsDto))
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id/residents')
  @SkipThrottle()
  @ApiCreatedResponse({ type: PaginatedResidentsDto })
  async getCompanyResidents(
    @Param('id') id: string,
    @Query() pageOptions: PageOptionsDto,
  ): Promise<PaginatedResidentsDto> {
    return this.companiesService.getCompanyResidents(id, pageOptions);
  }
}
