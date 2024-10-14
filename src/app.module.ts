import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PrismaCrudModule } from 'nestjs-prisma-crud';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';

import config from '@common/configs/config';
import { RateLimitConfig } from '@common/configs/config.interface';

import { AccessControlModule } from './access-control/access-control.module';
import { AccessGroupModule } from './access-groups/access-group.module';
import { AccessKeyModule } from './access-key/access-key.module';
import { AccessKeyProviderModule } from './access-key-provider/access-key-provider.module';
import { AccessTimeModule } from './access-times/access-time.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ConfigurationsModule } from './configurations/configuration.module';
import { CountriesModule } from './countries/countries.module';
import { DevicesModule } from './devices/devices.module';
import { MqttModule } from './mqtt/mqtt.module';
import { PermissionModule } from './permissions/permission.module';
import { PrismaService } from './prisma/prisma.service';
import { RoleModule } from './roles/role.module';
import { SiteModule } from './sites/site.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TwilioModule } from './twilio/twilio.module';
import { UsersModule } from './users/users.module';
import { VersionModule } from './version/version.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    WinstonModule.forRoot(config().winston),
    PrismaCrudModule.register({
      prismaService: PrismaService,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        configService.get<RateLimitConfig>('rateLimit'),
      ],
    }),
    AccessControlModule,
    AccessGroupModule,
    AccessKeyModule,
    AccessKeyProviderModule,
    AccessTimeModule,
    AuthModule,
    CompaniesModule,
    ConfigurationsModule,
    CountriesModule,
    DevicesModule,
    MqttModule,
    PermissionModule,
    RoleModule,
    SiteModule,
    StatisticsModule,
    TwilioModule,
    UsersModule,
    VersionModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
