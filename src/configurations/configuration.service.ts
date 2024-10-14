import { Configuration } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { omit as _omit } from 'lodash';

import { PrismaService } from '@~prisma/prisma.service';

import { UpdateConfigurationDto, ConfigurationDto } from './dto';

@Injectable()
export class ConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(payload: ConfigurationDto): Promise<Configuration> {
    const configuration = _omit(payload, ['id', 'createdAt', 'updatedAt']);
    return this.prisma.configuration.upsert({
      create: configuration,
      update: configuration,
      where: { id: payload?.id ?? 0 },
    });
  }

  async update(
    id: string,
    payload: UpdateConfigurationDto,
  ): Promise<ConfigurationDto> {
    const configuration = await this.prisma.configuration.update({
      where: { id: parseInt(id, 10) },
      data: payload,
    });

    return configuration;
  }
}
