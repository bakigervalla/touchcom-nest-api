import { Module } from '@nestjs/common';

import { AccessControlController } from './access-control.controller';

@Module({
  imports: [],
  controllers: [AccessControlController],
  providers: [],
})
export class AccessControlModule {}
