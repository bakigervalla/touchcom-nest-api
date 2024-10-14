import { Injectable } from '@nestjs/common';

import { PrismaService } from '@~prisma/prisma.service';

import { CreatePermissionDto, UpdatePermissionDto, PermissionDto } from './dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreatePermissionDto): Promise<PermissionDto> {
    return this.prisma.permission.create({
      data: {
        ...payload,
        roles: {
          create: payload.roles,
        },
      },
    });
  }

  async update(
    permissionId: number,
    payload: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    const updatedPermissions = await this.prisma.permission.update({
      where: { id: permissionId },
      data: {
        ...payload,
        roles: {
          deleteMany: {
            permissionId,
          },
          create: payload.roles,
        },
      },
    });

    return updatedPermissions;
  }
}
