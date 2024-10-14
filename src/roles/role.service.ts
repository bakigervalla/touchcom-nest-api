import { BadRequestException, Injectable } from '@nestjs/common';
import { omit as _omit } from 'lodash';

import { Permission, PublicErrors } from '@common/types';
import { PrismaService } from '@~prisma/prisma.service';
import { UserDto } from '@users/dto';

import { CreateRoleDto, RoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(payload: CreateRoleDto): Promise<RoleDto> {
    if (payload.id) {
      await this.prisma.rolePermission.deleteMany({
        where: { roleId: payload.id },
      });
    }

    const omittedPayload = _omit(payload, [
      'id',
      'permissions',
      'createdAt',
      'updatedAt',
    ]);
    const role = await this.prisma.role.upsert({
      create: {
        ...omittedPayload,
        key: omittedPayload.name.replace(' ', '_').toUpperCase(),
      },
      update: omittedPayload,
      where: { id: payload?.id ?? 0 },
    });

    for (const rolePermission of payload.permissions) {
      await this.prisma.rolePermission.create({
        data: { roleId: role.id, permissionId: rolePermission.permissionId },
      });
    }

    return this.prisma.role.findFirst({
      where: { id: role.id },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async getDeviceSetupRoles(): Promise<RoleDto[]> {
    return this.prisma.role.findMany({
      where: {
        permissions: {
          some: {
            permission: {
              key: {
                in: [Permission.DEVICE],
              },
            },
          },
        },
      },
    });
  }

  async checkIfUserHasDeviceSetupRole(user: UserDto): Promise<void> {
    const deviceSetupRoles = await this.getDeviceSetupRoles();
    if (!deviceSetupRoles.some((role) => role.id === user.roleId)) {
      throw new BadRequestException({
        code: PublicErrors.USER_DEVICE_ACCESS_FORBIDDEN,
        message: "You don't have permissions to enter",
      });
    }
  }
}
