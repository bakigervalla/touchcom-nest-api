import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import {
  Param,
  Body,
  Controller,
  Post,
  Patch,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { GenericController } from '@generics/generic.controller';
import { JwtAuthGuard } from '@auth/strategy';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';

import { AccessKeyProviderService } from './access-key-provider.service';

import {
  CreateAccessKeyProviderDto,
  AccessKeyProviderDto,
  UpdateAccessKeyProviderDto,
} from './dto';

@Controller('access-key-providers')
@ApiTags('Access Key Providers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class AccessKeyProviderController extends GenericController<
  AccessKeyProviderDto,
  CreateAccessKeyProviderDto,
  UpdateAccessKeyProviderDto
> {
  constructor(
    private readonly accessKeyProviderService: AccessKeyProviderService,
  ) {
    super('accessKeyProvider');
  }

  @Post()
  @ApiCreatedResponse({ type: AccessKeyProviderDto })
  override async create(
    @Body() payload: CreateAccessKeyProviderDto,
    @Query('crudQuery') _crudQuery?: string,
  ): Promise<AccessKeyProviderDto> {
    return this.accessKeyProviderService.create(payload);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: AccessKeyProviderDto })
  override async update(
    @Param('id') id: string,
    @Body() payload: UpdateAccessKeyProviderDto,
    @Query('crudQuery') _crudQuery?: string,
  ): Promise<AccessKeyProviderDto> {
    return this.accessKeyProviderService.update(parseInt(id, 10), payload);
  }
}
