import { SetMetadata } from '@nestjs/common';

export type UserRoles = 'admin' | 'moderator' | 'user';

export const ROLES_KEY = 'roles';
export const Roles = (...role: UserRoles[]) => SetMetadata(ROLES_KEY, role);
