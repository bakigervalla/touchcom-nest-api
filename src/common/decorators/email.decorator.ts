import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PrismaService } from '@~prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailRegisteredValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return !user;
  }
}

export function IsEmailRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailRegisteredValidator,
    });
  };
}
