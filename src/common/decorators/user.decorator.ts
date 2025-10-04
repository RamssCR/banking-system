import { AuthRequest } from '#types/auth';
import { JwtPayload } from '#auth/interfaces/jwt-payload.interface';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const User = createParamDecorator((user: keyof JwtPayload, context) => {
  const request = context.switchToHttp().getRequest<AuthRequest>();
  if (request.user) return request.user[user];
  throw new UnauthorizedException('User not authenticated');
});
