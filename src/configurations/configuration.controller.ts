import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Param,
  Patch,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { ConfigurationService } from './configuration.service';
import { JwtAuthGuard } from '@auth/strategy';
import { PrismaClientExceptionFilter } from '@~prisma/client-exception';

import { UpdateConfigurationDto, ConfigurationDto } from './dto';

@Controller('configurations')
@ApiTags('Configurations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Patch(':id')
  @ApiCreatedResponse({ type: ConfigurationDto })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateConfigurationDto,
  ): Promise<ConfigurationDto> {
    return this.configurationService.update(id, payload);
  }
}
