import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint()
@Injectable()
export class EmailExistsValidation implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(email: string): Promise<boolean> {
    return this.userService.findUserByEmail(email).then((data) => {
      if (data !== null) {
        return true;
      } else {
        return false;
      }
    });
  }

  defaultMessage() {
    return `Email already exists`;
  }
}

export function IsEmailExists(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'EmailExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: EmailExistsValidation,
    });
  };
}
