import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { GenericController } from '@generics/generic.controller';
import { JwtAuthGuard } from '@auth/strategy';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';
import { UserDto } from '@users/dto';

import { SessionUser } from '@common/decorators/user.decorator';

import { CreateRoleDto, RoleDto, UpdateRoleDto } from './dto';
import { RoleService } from './role.service';

@Controller('roles')
@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class RoleController extends GenericController<
  RoleDto,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor(private readonly roleService: RoleService) {
    super('role', ['permissions', 'permissions.permission']);
  }

  @Post()
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiCreatedResponse({ type: RoleDto })
  override async upsert(
    @SessionUser() _user: UserDto,
    @Body() payload: CreateRoleDto,
  ): Promise<RoleDto> {
    return this.roleService.upsert(payload);
  }
}
