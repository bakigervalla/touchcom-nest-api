import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AccessControlService } from '@access-control/access-control.service';

import { HiveMQConfig } from '@common/configs/config.interface';

import { MqttController } from './mqtt.controller';

@Module({
  imports: [],
  controllers: [MqttController],
  providers: [
    {
      provide: 'DEVICE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const hiveMQConfig = configService.get<HiveMQConfig>('hiveMQ');

        return ClientProxyFactory.create({
          transport: Transport.MQTT,
          options: {
            url: `wss://${hiveMQConfig.host}:${hiveMQConfig.port}/mqtt`,
            host: hiveMQConfig.host,
            username: hiveMQConfig.username,
            password: hiveMQConfig.password,
            port: hiveMQConfig.port,
            protocol: 'wss',
            rejectUnauthorized: true,
          },
        });
      },
      inject: [ConfigService],
    },
    AccessControlService,
  ],
  exports: ['DEVICE_SERVICE'],
})
export class MqttModule {}
