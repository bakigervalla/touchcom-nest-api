import { Module } from '@nestjs/common';

import { AccessTimeService } from './access-time.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AccessTimeService],
})
export class AccessTimeModule {}
