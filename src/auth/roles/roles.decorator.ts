import { SetMetadata } from '@nestjs/common';
import Role from '../role/role.enum';

export const Roles = (...args: Role[]) => SetMetadata('roles', args);
