import {
  Body,
  Controller,
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
import { SkipThrottle, Throttle } from '@nestjs/throttler';

import { DeviceDto } from '@devices/dto';
import { Pagination } from '@common/entities';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';

import { JwtAuthGuard } from '@auth/strategy/jwt-auth.guard';
import { ServiceAccessGuard } from '@common/guards/service-access.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { SessionUser } from '@common/decorators/user.decorator';

import {
  PaginatedUsersDto,
  UserDto,
  InviteUserDto,
  ResendUserInvitationDto,
  CreateUserDto,
} from './dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
@UseInterceptors(new TransformInterceptor(UserDto))
@UseInterceptors(new TransformInterceptor(PaginatedUsersDto))
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  async findMany(
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<Pagination<UserDto>> {
    return this.userService.getUsers(crudQuery, user);
  }

  @Get(':id')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  async findOne(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user?: UserDto,
  ): Promise<UserDto> {
    return this.userService.getUser(parseInt(id, 10), crudQuery, user);
  }

  @Post()
  @Throttle({ default: { limit: 150, ttl: 60000 } })
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: UserDto })
  async upsert(
    @Body() payload: CreateUserDto,
    @SessionUser() user?: UserDto,
  ): Promise<UserDto> {
    return this.userService.upsert(payload, user);
  }

  @Post('invite')
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: UserDto })
  async inviteUser(
    @SessionUser() user: UserDto,
    @Body() payload: InviteUserDto,
  ): Promise<UserDto> {
    return this.userService.inviteUser(user, payload);
  }

  @Post('invite/resend')
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: UserDto })
  async resendUserInvitation(
    @SessionUser() user: UserDto,
    @Body() payload: ResendUserInvitationDto,
  ): Promise<UserDto> {
    return this.userService.resendUserInvitation(user, payload);
  }

  @Get(':id/devices')
  @SkipThrottle()
  @UseGuards(ServiceAccessGuard)
  @ApiCreatedResponse({ type: Pagination<DeviceDto> })
  async getUserDevices(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() user: UserDto,
  ): Promise<Pagination<DeviceDto & { isVisible: boolean }>> {
    return this.userService.getUserDevices(parseInt(id, 10), crudQuery, user);
  }

  @Post(':id/change-image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2e6 } }))
  @ApiCreatedResponse({ type: UserDto })
  async changeImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserDto> {
    return this.userService.changeImage(file, parseInt(id, 10));
  }
}
