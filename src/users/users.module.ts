import { Module } from '@nestjs/common';

import { GoogleStorageService } from '@~google-cloud/google-storage.service';
import { PasswordService } from '@auth/password.service';
import { SiteService } from '@sites/site.service';
import { TwilioModule } from '@twilio/twilio.module';

import { PhoneNumberValidator } from '@common/decorators/phone-number.decorator';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TwilioModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    SiteService,
    PasswordService,
    PhoneNumberValidator,
    GoogleStorageService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
