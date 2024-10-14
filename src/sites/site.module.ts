import { Module } from '@nestjs/common';

import { GoogleStorageService } from '@~google-cloud/google-storage.service';

import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  imports: [],
  controllers: [SiteController],
  providers: [SiteService, GoogleStorageService],
})
export class SiteModule {}
