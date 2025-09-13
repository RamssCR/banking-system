import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoles, ROLES_KEY } from '#common/decorators/roles.decorator';
import { AuthRequest } from '#types/auth';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest<AuthRequest>();
    return roles.some((role) => role === user?.role);
  }
}
