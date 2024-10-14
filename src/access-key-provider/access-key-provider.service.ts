import { AccessKeyProvider } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { omit as _omit } from 'lodash';

import { PrismaService } from '@~prisma/prisma.service';

import {
  CreateAccessKeyProviderDto,
  UpdateAccessKeyProviderDto,
  AccessKeyProviderDto,
} from './dto';

@Injectable()
export class AccessKeyProviderService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(payload: AccessKeyProviderDto): Promise<AccessKeyProvider> {
    const accessKeyProvider = _omit(payload, ['id', 'createdAt', 'updatedAt']);
    return this.prisma.accessKeyProvider.upsert({
      create: accessKeyProvider,
      update: accessKeyProvider,
      where: { id: payload?.id ?? 0 },
    });
  }

  async create(
    payload: CreateAccessKeyProviderDto,
  ): Promise<AccessKeyProviderDto> {
    return this.prisma.accessKeyProvider.create({
      data: {
        ...payload,
        accessKeys: {
          create: payload.accessKeys,
        },
      },
    });
  }

  async update(
    accessKeyProviderId: number,
    payload: UpdateAccessKeyProviderDto,
  ): Promise<AccessKeyProviderDto> {
    const updatedAccessKeyProvider = await this.prisma.accessKeyProvider.update(
      {
        where: { id: accessKeyProviderId },
        data: {
          ...payload,
          accessKeys: {
            deleteMany: {
              accessKeyProviderId: accessKeyProviderId,
            },
            create: payload.accessKeys,
          },
        },
      },
    );

    return updatedAccessKeyProvider;
  }
}
