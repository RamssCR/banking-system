import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '#types/auth';

export const Cookies = createParamDecorator(
  (cookie: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.cookies?.[cookie];
  },
);
