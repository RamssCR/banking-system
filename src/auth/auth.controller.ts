import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import type { AuthRequest } from '#types/auth';
import type { Response } from 'express';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AuthService } from './auth.service';
import { Cookies } from '#common/decorators/cookies.decorator';
import { Public } from '#common/decorators/public.decorator';
import { SetAuthTokenInterceptor } from '#common/interceptors/set-auth-token.interceptor';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @UseInterceptors(SetAuthTokenInterceptor)
  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @Public()
  @UseInterceptors(SetAuthTokenInterceptor)
  @Post('signup')
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(dto);
  }

  @Public()
  @UseInterceptors(SetAuthTokenInterceptor)
  @Post('refresh')
  async refresh(
    @Cookies('refresh_token') token: string,
  ): Promise<Pick<AuthResponse, 'access_token'>> {
    return await this.authService.refresh(token);
  }

  @HttpCode(200)
  @Post('signout')
  async signOut(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const user = req.user;
    if (user) await this.authService.signOut(user.sub);
    const secure = this.config.get<string>('NODE_ENV') === 'production';

    res.clearCookie('access_token', {
      httpOnly: true,
      secure,
      sameSite: 'strict',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure,
      sameSite: 'strict',
    });
  }
}
