import { Module } from '@nestjs/common';

import { AccessControlService } from '@access-control/access-control.service';
import { ConfigurationService } from '@configurations/configuration.service';
import { GoogleStorageService } from '@~google-cloud/google-storage.service';
import { MqttModule } from '@mqtt/mqtt.module';
import { RoleService } from '@roles/role.service';
import { SiteService } from '@sites/site.service';
import { UsersModule } from '@users/users.module';
import { VersionService } from '@version/version.service';

import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

@Module({
  imports: [UsersModule, MqttModule],
  controllers: [DevicesController],
  providers: [
    SiteService,
    RoleService,
    DevicesService,
    VersionService,
    ConfigurationService,
    GoogleStorageService,
    AccessControlService,
  ],
  exports: [DevicesService],
})
export class DevicesModule {}
