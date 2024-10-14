import { Module } from '@nestjs/common';

import { AccessKeyProviderController } from './access-key-provider.controller';
import { AccessKeyProviderService } from './access-key-provider.service';

@Module({
  imports: [],
  controllers: [AccessKeyProviderController],
  providers: [AccessKeyProviderService],
})
export class AccessKeyProviderModule {}
