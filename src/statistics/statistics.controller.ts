import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { PrismaClientExceptionFilter } from '@~prisma/client-exception';
import { UserDto } from '@users/dto';

import { JwtAuthGuard } from '@auth/strategy/jwt-auth.guard';
import { ServiceAccessGuard } from '@common/guards/service-access.guard';
import { SessionUser } from '@common/decorators/user.decorator';

import { StatisticsService } from './statistics.service';
import { StatisticsDto, VisitorsFilter } from './dto';

@Controller('Statistics')
@ApiTags('statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: StatisticsDto })
  async getStatistics(
    @SessionUser() user: UserDto,
    @Query('visitorsFilter') visitorsFilter?: VisitorsFilter,
  ): Promise<StatisticsDto> {
    return this.statisticsService.getStatistics(user, visitorsFilter);
  }
}
