import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

import { SecurityConfig } from '@common/configs/config.interface';

@Injectable()
export class PasswordService {
  private bcryptSaltRounds: string | number;

  constructor(private configService: ConfigService) {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const saltOrRounds = securityConfig ? securityConfig.bcryptSaltOrRound : 10;

    this.bcryptSaltRounds = Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }
}
