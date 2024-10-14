import { Injectable } from '@nestjs/common';
import { Version } from '@prisma/client';
import { omit as _omit } from 'lodash';

import { PrismaService } from '@~prisma/prisma.service';

import { VersionDto } from './dto';

@Injectable()
export class VersionService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(payload: VersionDto): Promise<Version> {
    const cleanedVersion = _omit(payload, ['id', 'createdAt', 'updatedAt']);
    return this.prisma.version.upsert({
      create: cleanedVersion,
      update: cleanedVersion,
      where: { id: payload?.id ?? 0 },
    });
  }
}
