import { Module } from '@nestjs/common';

import { VersionController } from './version.controller';

@Module({
  imports: [],
  controllers: [VersionController],
  providers: [],
})
export class VersionModule {}
