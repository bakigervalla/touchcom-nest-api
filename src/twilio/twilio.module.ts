import { Module } from '@nestjs/common';

import { MqttModule } from '@mqtt/mqtt.module';

import { TwilioController } from './twilio.controller';
import { TwilioService } from './twilio.service';

@Module({
  imports: [MqttModule],
  controllers: [TwilioController],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
