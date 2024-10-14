import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTime } from '@prisma/client';
import { SkipThrottle } from '@nestjs/throttler';

import { AccessTimeScheduleDto } from '@common/dto';
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
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

import { AccessKeyService } from './access-key.service';
import {
  CreateAccessKeyDto,
  AccessKeyDto,
  UpdateAccessKeyDto,
  PaginatedAccessKeysDto,
  AccessKeysOverviewDto,
} from './dto';

@Controller('access-keys')
@ApiTags('Access Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(PermissionsGuard)
@UseFilters(PrismaClientExceptionFilter)
@UseInterceptors(new TransformInterceptor(AccessKeyDto))
@UseInterceptors(new TransformInterceptor(PaginatedAccessKeysDto))
export class AccessKeyController extends GenericController<
  AccessKeyDto,
  CreateAccessKeyDto,
  UpdateAccessKeyDto
> {
  constructor(private readonly accessKeyService: AccessKeyService) {
    super('accessKey');
  }

  @Get('overview')
  @ApiCreatedResponse({ type: AccessKeysOverviewDto })
  async getAccessKeysOverview(
    @SessionUser() user: UserDto,
  ): Promise<AccessKeysOverviewDto> {
    return this.accessKeyService.getAccessKeysOverview(user);
  }

  @Get('sync')
  @Permissions(Permission.DEVICE)
  @ApiCreatedResponse({ type: Pagination<AccessKeyDto> })
  async syncAccessKeys(
    @Query('crudQuery') crudQuery: string,
  ): Promise<Pagination<AccessKeyDto>> {
    return this.accessKeyService.syncAccessKeys(crudQuery);
  }

  @Post()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessKeyDto })
  override async upsert(
    @SessionUser() user: UserDto,
    @Body() payload: AccessKeyDto,
  ): Promise<AccessKeyDto> {
    return this.accessKeyService.upsert(payload, user);
  }

  @Get()
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: Pagination<AccessKeyDto> })
  override async findMany(
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<Pagination<AccessKeyDto>> {
    return this.accessKeyService.getAccessKeys(crudQuery, user);
  }

  @Get(':id')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessKeyDto })
  override async findOne(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<AccessKeyDto> {
    return this.accessKeyService.getAccessKey(parseInt(id), crudQuery, user);
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
    return this.accessKeyService.upsertTimeSchedule(
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
    return this.accessKeyService.getTimeSchedule(parseInt(id, 10), user);
  }

  @Delete(':id/time-schedule/:timeScheduleId/access-times/:accessTimeId')
  @UseGuards(ServiceAccessGuard)
  async deleteTimeScheduleAccessTime(
    @Param('id') id: string,
    @Param('timeScheduleId') timeScheduleId: string,
    @Param('accessTimeId') accessTimeId: string,
    @SessionUser() user: UserDto,
  ): Promise<AccessTime> {
    return this.accessKeyService.deleteTimeScheduleAccessTime(
      parseInt(id, 10),
      parseInt(timeScheduleId, 10),
      parseInt(accessTimeId, 10),
      user,
    );
  }

  @Post(':id/attach')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessKeyDto })
  async attachAccessKeyToUserAndDevice(
    @SessionUser() user: UserDto,
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Query('deviceId') deviceId: string,
  ): Promise<AccessKeyDto> {
    return this.accessKeyService.attachAccessKeyToUserAndDevice(
      parseInt(id, 10),
      parseInt(userId, 10),
      parseInt(deviceId, 10),
      user,
    );
  }

  @Post(':id/detach')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: AccessKeyDto })
  async detachAccessKeyFromUserAndDevice(
    @SessionUser() user: UserDto,
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Query('deviceId') deviceId: string,
  ): Promise<AccessKeyDto> {
    return this.accessKeyService.detachAccessKeyFromUserAndDevice(
      parseInt(id, 10),
      parseInt(userId, 10),
      parseInt(deviceId, 10),
      user,
    );
  }
}
