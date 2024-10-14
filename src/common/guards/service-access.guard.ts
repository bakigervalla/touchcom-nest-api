import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { JwtDto } from '@auth/dto';
import { PrismaService } from '@~prisma/prisma.service';

import { PublicErrors, UserRole } from '../types';

@Injectable()
export class ServiceAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuthorized =
      'authorization' in request.headers &&
      request.headers.authorization.includes('Bearer');

    if (!isAuthorized) {
      throw new BadRequestException({
        code: PublicErrors.ACCESS_DENIED,
        message: `Unable to perform requested operation`,
      });
    }

    const jwt = request.headers.authorization.replace('Bearer ', '');
    const jwtUser = this.getJwtUser(jwt);
    if (!jwtUser.activeSite) {
      return false;
    }

    const isUserSuperAdmin = jwtUser.role.key === UserRole.SUPER_ADMIN;
    if (isUserSuperAdmin) {
      return true;
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: jwtUser.email.toLowerCase(),
        sites: { some: { siteId: jwtUser.activeSite.id } },
      },
    });

    return !!user;
  }

  private getJwtUser(jwt: string): JwtDto {
    const jwtService = new JwtService();
    const user = jwtService.decode(jwt) as JwtDto;

    if (!user) {
      throw new BadRequestException({
        code: PublicErrors.ACCESS_DENIED,
        message: `Unable to perform requested operation`,
      });
    }

    return user;
  }
}
