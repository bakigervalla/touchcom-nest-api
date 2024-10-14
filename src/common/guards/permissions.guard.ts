import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { JwtDto } from '@auth/dto';
import { PermissionDto } from '@permissions/dto';
import { PrismaService } from '@~prisma/prisma.service';
import { UserDto } from '@users/dto';

import { PublicErrors } from '../types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { body } = request;
    const isAuthorized =
      'authorization' in request.headers &&
      request.headers.authorization.includes('Bearer');
    if (isAuthorized) {
      const jwt = request.headers.authorization.replace('Bearer ', '');
      const jwtUser = this.getJwtUser(jwt);
      return this.hasUserAllRequiredPermissions(
        requiredPermissions,
        jwtUser.role.permissions,
      );
    }

    if (!('email' in body)) {
      return false;
    }

    const user = await this.getUserByEmail(body.email);

    return this.hasUserAllRequiredPermissions(
      requiredPermissions,
      user.role.permissions,
    );
  }

  private getJwtUser(jwt: string): JwtDto {
    const jwtService = new JwtService();
    const user = jwtService.decode(jwt) as JwtDto;

    if (!user) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    return user;
  }

  private async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        role: { include: { permissions: { select: { permission: true } } } },
      },
    });

    if (!user) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    return user;
  }

  private hasUserAllRequiredPermissions(
    requiredPermissions: string[],
    userPermissions: { permission: PermissionDto }[],
  ): boolean {
    return requiredPermissions.every((requiredPermission: string) =>
      userPermissions.some(
        ({ permission }: { permission: PermissionDto }) =>
          permission.key === requiredPermission,
      ),
    );
  }
}
