import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AuthService } from './auth.service';
import { Cookies } from '#common/decorators/cookies.decorator';
import { Public } from '#common/decorators/public.decorator';
import { SetAuthTokenInterceptor } from '#common/interceptors/set-auth-token.interceptor';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
@UseInterceptors(SetAuthTokenInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Cookies('refresh_token') token: string,
  ): Promise<Pick<AuthResponse, 'access_token'>> {
    return await this.authService.refresh(token);
  }

  @HttpCode(200)
  @Post('signout')
  async signout(): Promise<void> {}
}
