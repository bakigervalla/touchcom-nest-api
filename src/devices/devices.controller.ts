import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import {
  Param,
  Body,
  Controller,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Delete,
  Get,
  ParseBoolPipe,
} from '@nestjs/common';
import { Diagnostics } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

import { AccessGroupDto } from '@access-groups/dto';
import { ConfigurationDto, CreateConfigurationDto } from '@configurations/dto';
import { GenericController } from '@generics/generic.controller';
import { JwtAuthGuard } from '@auth/strategy';
import { Pagination } from '@common/entities';
import { Permission } from '@common/types';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';
import { UserDto } from '@users/dto';

import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { ServiceAccessGuard } from '@common/guards/service-access.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { SessionUser } from '@common/decorators/user.decorator';

import {
  AccessKeyUnlockEvent,
  CreateDeviceDto,
  DeviceDto,
  DevicesOverviewDto,
  PaginatedDevicesDto,
  UpdateDeviceDto,
} from './dto';
import { DevicesService } from './devices.service';

@Controller('devices')
@ApiTags('Devices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(PermissionsGuard)
@UseFilters(PrismaClientExceptionFilter)
@UseInterceptors(new TransformInterceptor(DeviceDto))
@UseInterceptors(new TransformInterceptor(PaginatedDevicesDto))
export class DevicesController extends GenericController<
  DeviceDto,
  CreateDeviceDto,
  UpdateDeviceDto
> {
  constructor(private readonly deviceService: DevicesService) {
    super('device', [
      'site',
      'site.address',
      'site.address.country',
      'diagnostics',
      'configuration',
      'version',
      'accessControls',
      'accessControls.accessGroup',
      'accessControls.user',
      'accessControls.user.role',
      'accessControls.accessKey',
    ]);
  }

  @Get('overview')
  @ApiCreatedResponse({ type: DevicesOverviewDto })
  async getDevicesOverview(
    @SessionUser() user: UserDto,
  ): Promise<DevicesOverviewDto> {
    return this.deviceService.getDevicesOverview(user);
  }

  @Get('user')
  @SkipThrottle()
  @Permissions(Permission.MOBILE)
  async getUserDevices(
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<Pagination<DeviceDto>> {
    return this.deviceService.getUserDevices(crudQuery, user);
  }

  @Post('registration')
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: DeviceDto })
  async deviceRegistration(
    @Body() payload: CreateDeviceDto,
    @SessionUser() user: UserDto,
  ): Promise<DeviceDto> {
    return this.deviceService.registerNewDevice(payload, user);
  }

  @Post()
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: DeviceDto })
  override async upsert(
    @SessionUser() user: UserDto,
    @Body() payload: DeviceDto,
  ): Promise<DeviceDto> {
    return this.deviceService.upsert(payload, user);
  }

  @Get()
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  override async findMany(
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<Pagination<DeviceDto>> {
    return this.deviceService.getDevices(crudQuery, user);
  }

  @Get(':id')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  override async findOne(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<DeviceDto> {
    return this.deviceService.getDevice(parseInt(id), crudQuery, user);
  }

  @Post(':id/diagnostics')
  @UseInterceptors(FileInterceptor('file'))
  async deviceDiagnosticsReport(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() diagnostics: Diagnostics,
  ): Promise<void> {
    return this.deviceService.deviceDiagnosticsReport(
      diagnostics,
      file,
      parseInt(id, 10),
    );
  }

  @Post(':id/reset')
  @ApiCreatedResponse({ type: DeviceDto })
  async resetDevice(@Param('id') id: string): Promise<DeviceDto> {
    return this.deviceService.resetDevice(parseInt(id, 10));
  }

  @Delete(':id')
  override async remove(
    @Param('id') id: string,
    @Query('crudQuery') _crudQuery: string,
  ): Promise<DeviceDto> {
    return this.deviceService.removeDevice(parseInt(id, 10));
  }

  @Get(':id/configuration')
  @SkipThrottle()
  @ApiCreatedResponse({ type: ConfigurationDto })
  async getDeviceConfiguration(
    @Param('id') id: string,
  ): Promise<ConfigurationDto> {
    return this.deviceService.getDeviceConfiguration(parseInt(id, 10));
  }

  @Get(':id/configurations')
  @SkipThrottle()
  @ApiCreatedResponse({ type: ConfigurationDto })
  async getUserDeviceConfiguration(
    @Param('id') id: string,
    @SessionUser() user: UserDto,
  ): Promise<ConfigurationDto> {
    return this.deviceService.getUserDeviceConfiguration(user, id);
  }

  @Post(':id/configurations')
  @ApiCreatedResponse({ type: ConfigurationDto })
  async createUserDeviceConfiguration(
    @Param('id') id: string,
    @SessionUser() user: UserDto,
    @Body() payload: CreateConfigurationDto,
  ): Promise<ConfigurationDto> {
    return this.deviceService.createUserDeviceConfiguration(user, id, payload);
  }

  @Post(':id/initiate-gsm-call')
  @ApiCreatedResponse()
  async initiateGsmCall(
    @Param('id') id: string,
    @Body() callee: UserDto & { callId: string },
  ): Promise<void> {
    return this.deviceService.initiateGsmCall(parseInt(id, 10), callee);
  }

  @Post(':id/gsm-call-answered')
  @ApiCreatedResponse()
  async gsmCallAnswered(
    @Param('id') id: string,
    @Body() callee: UserDto & { callId: string },
  ): Promise<void> {
    return this.deviceService.gsmCallAnswered(parseInt(id, 10), callee);
  }

  @Post(':id/gsm-call-no-answer')
  @ApiCreatedResponse()
  async gsmCallNoAnswer(
    @Param('id') id: string,
    @Body() callee: UserDto & { callId: string },
  ): Promise<void> {
    return this.deviceService.gsmCallNoAnswer(parseInt(id, 10), callee);
  }

  @Post(':id/gsm-call-ended')
  @ApiCreatedResponse()
  async gsmCallEnded(
    @Param('id') id: string,
    @Body() callee: UserDto & { callId: string },
  ): Promise<void> {
    return this.deviceService.gsmCallEnded(parseInt(id, 10), callee);
  }

  @Post(':id/gsm-call-failed')
  @ApiCreatedResponse()
  async gsmCallFailed(
    @Param('id') id: string,
    @Body() callee: UserDto & { callId: string },
  ): Promise<void> {
    return this.deviceService.gsmCallFailed(parseInt(id, 10), callee);
  }

  @Post(':id/open-door')
  @ApiCreatedResponse()
  async openDoor(
    @Param('id') id: string,
    @Body() callee: UserDto & { callId: string },
  ): Promise<void> {
    return this.deviceService.openDoor(parseInt(id, 10), callee);
  }

  @Post(':id/access-key-logs')
  @ApiCreatedResponse()
  async accessKeyLogs(
    @Param('id') id: string,
    @Body() payload: AccessKeyUnlockEvent[],
  ): Promise<void> {
    return this.deviceService.accessKeyLogs(parseInt(id, 10), payload);
  }

  @Get(':id/users')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: Pagination<UserDto> })
  async getDeviceUsers(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user: UserDto,
  ): Promise<
    Pagination<UserDto & { isVisible: boolean; accessGroup: AccessGroupDto }>
  > {
    return this.deviceService.getDeviceUsers(parseInt(id, 10), crudQuery, user);
  }

  @Post(':id/users/:userId/change-visibility')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: UserDto })
  async changeUserVisibilityOnDevice(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Query('isVisible', ParseBoolPipe) isVisible: boolean,
    @SessionUser() user: UserDto,
  ): Promise<UserDto> {
    return this.deviceService.changeUserVisibilityOnDevice(
      parseInt(id, 10),
      parseInt(userId, 10),
      isVisible,
      user,
    );
  }

  @Post(':id/users/:userId/add')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: UserDto })
  async addUserToDevice(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @SessionUser() user: UserDto,
  ): Promise<UserDto> {
    return this.deviceService.addUserToDevice(
      parseInt(id, 10),
      parseInt(userId, 10),
      user,
    );
  }

  @Post(':id/users/:userId/remove')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: UserDto })
  async removeUserFromDevice(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @SessionUser() user: UserDto,
  ): Promise<UserDto> {
    return this.deviceService.removeUserFromDevice(
      parseInt(id, 10),
      parseInt(userId, 10),
      user,
    );
  }

  @Post(':id/change-image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2e6 } }))
  @ApiCreatedResponse({ type: DeviceDto })
  async changeImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DeviceDto> {
    return this.deviceService.changeImage(file, parseInt(id, 10));
  }
}
