import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { PrismaService } from '@~prisma/prisma.service';
import { UserDto } from '@users/dto';

import { JwtDto } from '../dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtDto): Promise<UserDto> {
    const { email, activeSite } = payload;
    const user: UserDto = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        accessControls: {
          include: { device: true, accessGroup: true, accessKey: true },
        },
        sites: { include: { site: true } },
        role: { include: { permissions: { select: { permission: true } } } },
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    user.activeSite = activeSite;

    return user;
  }
}
