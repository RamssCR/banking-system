import {
  type ExecutionContext,
  type NestInterceptor,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { AuthResponse } from '#auth/interfaces/auth-response.interface';
import type { Response } from 'express';

@Injectable()
export class SetAuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: AuthResponse) => {
        if (data.access_token) {
          res.cookie('access_token', data.access_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
          });
        }

        if (data.refresh_token) {
          res.cookie('refresh_token', data.refresh_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: false,
          });
        }

        return {
          message: 'login successful',
          user: data?.user,
        };
      }),
    );
  }
}
