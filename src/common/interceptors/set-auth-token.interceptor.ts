import {
  type ExecutionContext,
  type NestInterceptor,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { AuthResponse } from '#auth/interfaces/auth-response.interface';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SetAuthTokenInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const secure = this.config.get<string>('NODE_ENV') === 'production';

    return next.handle().pipe(
      map((data: AuthResponse) => {
        if (data.access_token) {
          res.cookie('access_token', data.access_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24,
            secure,
          });
        }

        if (data.refresh_token) {
          res.cookie('refresh_token', data.refresh_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure,
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
