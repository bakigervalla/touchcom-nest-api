import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { GenericController } from '@generics/generic.controller';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';

import { JwtAuthGuard } from '@auth/strategy/jwt-auth.guard';

import { VersionDto, CreateVersionDto, UpdateVersionDto } from './dto';

@Controller('versions')
@ApiTags('Versions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class VersionController extends GenericController<
  VersionDto,
  CreateVersionDto,
  UpdateVersionDto
> {
  constructor() {
    super('version', ['devices']);
  }
}
