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
export class UsernameExistsValidation implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(username: string): Promise<boolean> {
    return this.userService.findUserByUsername(username).then((data) => {
      if (data !== null) {
        return true;
      } else {
        return false;
      }
    });
  }

  defaultMessage() {
    return `Username already exists`;
  }
}

export function IsUsernameExists(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UsernameExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: UsernameExistsValidation,
    });
  };
}
