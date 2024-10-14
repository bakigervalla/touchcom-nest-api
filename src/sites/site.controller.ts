import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';

import { Pagination } from '@common/entities';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';
import { UserDto } from '@users/dto';

import { JwtAuthGuard } from '@auth/strategy/jwt-auth.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { SessionUser } from '@common/decorators/user.decorator';

import { SiteDto, PaginatedSitesDto, SitesOverviewDto } from './dto';
import { SiteService } from './site.service';

@Controller('sites')
@ApiTags('Sites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
@UseInterceptors(new TransformInterceptor(SiteDto))
@UseInterceptors(new TransformInterceptor(PaginatedSitesDto))
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('overview')
  @ApiCreatedResponse({ type: SitesOverviewDto })
  async getSitesOverview(
    @SessionUser() user: UserDto,
  ): Promise<SitesOverviewDto> {
    return this.siteService.getSitesOverview(user);
  }

  @Get()
  @SkipThrottle()
  @ApiCreatedResponse({ type: SiteDto })
  async findMany(
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<Pagination<SiteDto>> {
    return this.siteService.getSites(crudQuery, user);
  }

  @Get(':id')
  @SkipThrottle()
  @ApiCreatedResponse({ type: SiteDto })
  async findOne(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<SiteDto> {
    return this.siteService.getSite(parseInt(id, 10), crudQuery, user);
  }

  @Post()
  @ApiCreatedResponse({ type: SiteDto })
  async upsert(
    @SessionUser() user: UserDto,
    @Body() payload: SiteDto,
  ): Promise<SiteDto> {
    return this.siteService.upsert(user, payload);
  }

  @Delete(':id')
  async removeSite(
    @Param('id') id: string,
    @SessionUser() user: UserDto,
    @Query('crudQuery') _crudQuery: string,
  ): Promise<SiteDto> {
    return this.siteService.removeSite(parseInt(id, 10), user);
  }

  @Post(':id/change-image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2e6 } }))
  @ApiCreatedResponse({ type: SiteDto })
  async changeImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SiteDto> {
    return this.siteService.changeImage(file, parseInt(id, 10));
  }
}
