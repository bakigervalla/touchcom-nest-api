import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'phoneNumber', async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
  validate(phoneNumber: string): boolean {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phoneNumber);
  }

  defaultMessage(): string {
    return 'Invalid phone number format. It should start with a 3-digit country code and contain only numbers.';
  }
}

export function IsPhoneNumber(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (
    object: Record<string, any>,
    propertyName: string | symbol,
  ): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      constraints: [],
      validator: PhoneNumberValidator,
    });
  };
}
