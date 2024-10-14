import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Query,
  UseFilters,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { AccessTime } from '@prisma/client';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

import { AccessTimeScheduleDto } from '@common/dto';
import { DeviceDto } from '@devices/dto';
import { GenericController } from '@generics/generic.controller';
import { JwtAuthGuard } from '@auth/strategy';
import { Pagination } from '@common/entities';
import { Permission } from '@common/types';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';
import { UserDto } from '@users/dto';

import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { ServiceAccessGuard } from '@common/guards/service-access.guard';
import { SessionUser } from '@common/decorators/user.decorator';

import { AccessGroupService } from './access-group.service';

import {
  CreateAccessGroupDto,
  AccessGroupDto,
  UpdateAccessGroupDto,
  AccessExceptionDto,
  AccessGroupAccessExceptionDto,
} from './dto';

@Controller('access-groups')
@ApiTags('Access Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(PermissionsGuard)
@UseFilters(PrismaClientExceptionFilter)
export class AccessGroupController extends GenericController<
  AccessGroupDto,
  CreateAccessGroupDto,
  UpdateAccessGroupDto
> {
  constructor(private readonly accessGroupService: AccessGroupService) {
    super('accessGroup');
  }

  @Get('sync')
  @Permissions(Permission.DEVICE)
  @ApiCreatedResponse({ type: Pagination<AccessGroupDto> })
  async syncAccessGroups(
    @Query('crudQuery') crudQuery: string,
  ): Promise<Pagination<AccessGroupDto>> {
    return this.accessGroupService.syncAccessGroups(crudQuery);
  }

  @Get()
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: Pagination<AccessGroupDto> })
  override async findMany(
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<Pagination<AccessGroupDto>> {
    return this.accessGroupService.getAccessGroups(crudQuery, user);
  }

  @Get(':id')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessGroupDto })
  override async findOne(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<AccessGroupDto> {
    return this.accessGroupService.getAccessGroup(
      parseInt(id),
      crudQuery,
      user,
    );
  }

  @Post()
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessGroupDto })
  override async upsert(
    @SessionUser() user: UserDto,
    @Body() payload: AccessGroupDto,
  ): Promise<AccessGroupDto> {
    return this.accessGroupService.upsert(payload, user);
  }

  @Get(':id/devices')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: Pagination<DeviceDto> })
  async getAccessGroupDevices(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user: UserDto,
  ): Promise<Pagination<DeviceDto>> {
    return this.accessGroupService.getAccessGroupDevices(
      parseInt(id, 10),
      crudQuery,
      user,
    );
  }

  @Get(':id/users')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: Pagination<UserDto> })
  async getAccessGroupUsers(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user: UserDto,
  ): Promise<Pagination<UserDto>> {
    return this.accessGroupService.getAccessGroupUsers(
      parseInt(id, 10),
      crudQuery,
      user,
    );
  }

  @Post(':id/time-schedule')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessTimeScheduleDto })
  async upsertTimeSchedule(
    @Param('id') id: string,
    @Body() payload: AccessTimeScheduleDto,
    @SessionUser() user: UserDto,
  ): Promise<AccessTimeScheduleDto> {
    return this.accessGroupService.upsertTimeSchedule(
      parseInt(id, 10),
      payload,
      user,
    );
  }

  @Get(':id/time-schedule')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessTimeScheduleDto })
  async getTimeSchedule(
    @Param('id') id: string,
    @SessionUser() user: UserDto,
  ): Promise<AccessTimeScheduleDto> {
    return this.accessGroupService.getTimeSchedule(parseInt(id, 10), user);
  }

  @Delete(':id/time-schedule/:timeScheduleId/access-times/:accessTimeId')
  @UseGuards(ServiceAccessGuard)
  async deleteTimeScheduleAccessTime(
    @Param('id') id: string,
    @Param('timeScheduleId') timeScheduleId: string,
    @Param('accessTimeId') accessTimeId: string,
    @SessionUser() user: UserDto,
  ): Promise<AccessTime> {
    return this.accessGroupService.deleteTimeScheduleAccessTime(
      parseInt(id, 10),
      parseInt(timeScheduleId, 10),
      parseInt(accessTimeId, 10),
      user,
    );
  }

  @Post(':id/exceptions')
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessGroupAccessExceptionDto })
  async upsertException(
    @Param('id') id: string,
    @Body() payload: AccessExceptionDto,
    @SessionUser() user: UserDto,
  ): Promise<AccessGroupAccessExceptionDto> {
    return this.accessGroupService.upsertException(
      parseInt(id, 10),
      payload,
      user,
    );
  }

  @Get(':id/exceptions')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: Pagination<AccessGroupAccessExceptionDto> })
  async getExceptions(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user: UserDto,
  ): Promise<Pagination<AccessGroupAccessExceptionDto>> {
    return this.accessGroupService.getExceptions(
      parseInt(id, 10),
      crudQuery,
      user,
    );
  }

  @Delete(':id/exceptions/:exceptionId')
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessExceptionDto })
  async deleteException(
    @Param('id') id: string,
    @Param('exceptionId') exceptionId: string,
    @SessionUser() user: UserDto,
  ): Promise<AccessExceptionDto> {
    return this.accessGroupService.deleteException(
      parseInt(id, 10),
      parseInt(exceptionId, 10),
      user,
    );
  }

  @Post(':id/attach')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  async attachAccessGroupToUserAndDevice(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Query('deviceId') deviceId: string,
    @SessionUser() user: UserDto,
  ): Promise<UserDto | DeviceDto> {
    return this.accessGroupService.attachAccessGroupToUserAndDevice(
      parseInt(id, 10),
      parseInt(userId, 10),
      parseInt(deviceId, 10),
      user,
    );
  }

  @Post(':id/detach')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  async detachAccessGroupFromUserAndDevice(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Query('deviceId') deviceId: string,
    @SessionUser() user: UserDto,
  ): Promise<UserDto | DeviceDto> {
    return this.accessGroupService.detachAccessGroupFromUserAndDevice(
      parseInt(id, 10),
      parseInt(userId, 10),
      parseInt(deviceId, 10),
      user,
    );
  }
}
