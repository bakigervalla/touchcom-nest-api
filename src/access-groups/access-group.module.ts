import { Module } from '@nestjs/common';

import { AccessTimeService } from '@access-times/access-time.service';

import { AccessGroupController } from './access-group.controller';
import { AccessGroupService } from './access-group.service';

@Module({
  imports: [],
  controllers: [AccessGroupController],
  providers: [AccessGroupService, AccessTimeService],
})
export class AccessGroupModule {}
