import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { GenericController } from '@generics/generic.controller';
import { JwtAuthGuard } from '@auth/strategy';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';

import { CreatePermissionDto, PermissionDto, UpdatePermissionDto } from './dto';
import { PermissionService } from './permission.service';

@Controller('permissions')
@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class PermissionController extends GenericController<
  PermissionDto,
  CreatePermissionDto,
  UpdatePermissionDto
> {
  constructor(private readonly permissionService: PermissionService) {
    super('permission', ['roles', 'roles.role']);
  }

  @Post()
  @ApiCreatedResponse({ type: PermissionDto })
  override async create(
    @Body() payload: CreatePermissionDto,
    @Query('crudQuery') _crudQuery?: string,
  ): Promise<PermissionDto> {
    return this.permissionService.create(payload);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: PermissionDto })
  override async update(
    @Param('id') id: string,
    @Body() payload: UpdatePermissionDto,
    @Query('crudQuery') _crudQuery?: string,
  ): Promise<PermissionDto> {
    return this.permissionService.update(parseInt(id, 10), payload);
  }
}
