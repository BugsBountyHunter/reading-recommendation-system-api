import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@app/modules/users/enums/role.enum';

export const ROLES_KEY = 'roles';
export const UserRolesDecorators = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
