import { Module } from '@nestjs/common';

import { AccessKeyProviderService } from '@access-key-provider/access-key-provider.service';
import { AccessTimeService } from '@access-times/access-time.service';

import { AccessKeyController } from './access-key.controller';
import { AccessKeyService } from './access-key.service';

@Module({
  imports: [],
  controllers: [AccessKeyController],
  providers: [AccessKeyService, AccessKeyProviderService, AccessTimeService],
})
export class AccessKeyModule {}
