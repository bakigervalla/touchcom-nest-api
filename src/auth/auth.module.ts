import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AccessControlService } from '@access-control/access-control.service';
import { DevicesModule } from '@devices/devices.module';
import { RoleService } from '@roles/role.service';
import { TwilioModule } from '@twilio/twilio.module';

import { SecurityConfig } from '@common/configs/config.interface';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, JwtAuthGuard } from './strategy';
import { PasswordService } from './password.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    DevicesModule,
    TwilioModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    PasswordService,
    AccessControlService,
    RoleService,
  ],
  exports: [JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
