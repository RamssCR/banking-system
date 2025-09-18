import { AuthRequest } from '#types/auth';
import { JwtPayload } from '#auth/interfaces/jwt-payload.interface.js';
import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((user: keyof JwtPayload, context) => {
  const request = context.switchToHttp().getRequest<AuthRequest>();
  if (request.user) return request.user[user];
});
