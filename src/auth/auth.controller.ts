import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AuthService } from './auth.service';
import { SetAuthTokenInterceptor } from '#common/interceptors/set-auth-token.interceptor';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import type { Request } from 'express';

interface AuthRequest extends Request {
  cookies: {
    refresh_token: string;
  };
}

@Controller('auth')
@UseInterceptors(SetAuthTokenInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @Post('signup')
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(dto);
  }

  @Post('refresh')
  async refresh(
    @Req() req: AuthRequest,
  ): Promise<Pick<AuthResponse, 'access_token'>> {
    const refreshToken = req.cookies?.['refresh_token'];
    return await this.authService.refresh(refreshToken);
  }
}
