import {
  Controller,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { GenericController } from '@generics/generic.controller';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';

import { JwtAuthGuard } from '@auth/strategy/jwt-auth.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

import {
  AccessControlDto,
  CreateAccessControlDto,
  UpdateAccessControlDto,
  PaginatedAccessControlsDto,
} from './dto';

@Controller('access-controls')
@ApiTags('AccessControls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
@UseInterceptors(new TransformInterceptor(AccessControlDto))
@UseInterceptors(new TransformInterceptor(PaginatedAccessControlsDto))
export class AccessControlController extends GenericController<
  AccessControlDto,
  CreateAccessControlDto,
  UpdateAccessControlDto
> {
  constructor() {
    super('accessControl', ['user', 'device', 'accessGroup', 'accessKey']);
  }
}
