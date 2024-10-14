import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { Pagination } from '@common/entities';
import { PublicErrors } from '@common/types';
import { UserDto } from '@users/dto';

import { SessionUser } from '@common/decorators/user.decorator';

import { GenericService } from './generic.service';

export abstract class GenericController<Dto, CreateDto, UpdateDto> {
  private service: GenericService;

  constructor(model: string, allowedJoins: string[] = []) {
    this.service = new GenericService(model, allowedJoins);
  }

  @Post()
  async upsert(
    @SessionUser() _user: UserDto,
    @Body() _payload: Dto,
  ): Promise<Dto> {
    throw new BadRequestException({
      code: PublicErrors.NOT_IMPLEMENTED,
      message: 'Endpoint not implemented',
    });
  }

  @Post()
  async create(
    @Body() createDto: CreateDto,
    @Query('crudQuery') crudQuery?: string,
    @SessionUser() _user?: UserDto,
  ): Promise<Dto> {
    return this.service.create(createDto, {
      crudQuery,
    });
  }

  @Get()
  @SkipThrottle()
  async findMany(
    @Query('crudQuery') crudQuery: string,
    @SessionUser() _user?: UserDto,
  ): Promise<Pagination<Dto>> {
    return this.service.findMany({ crudQuery });
  }

  @Get(':id')
  @SkipThrottle()
  async findOne(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() _user?: UserDto,
  ): Promise<Dto> {
    return this.service.findOne(parseInt(id, 10), { crudQuery });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @Query('crudQuery') crudQuery: string,
    @SessionUser() _user?: UserDto,
  ): Promise<Dto> {
    return this.service.update(parseInt(id, 10), updateDto, {
      crudQuery,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('crudQuery') crudQuery: string,
  ): Promise<Dto> {
    return this.service.remove(parseInt(id, 10), { crudQuery });
  }
}
