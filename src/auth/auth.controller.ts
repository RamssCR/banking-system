import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '#common/guards/auth.guard';
import { AuthResponse } from './interfaces/auth-response.interface';
import { AuthService } from './auth.service';
import { Cookies } from '#common/decorators/cookies.decorator';
import { SetAuthTokenInterceptor } from '#common/interceptors/set-auth-token.interceptor';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

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
  @UseGuards(AuthGuard)
  async refresh(
    @Cookies('refresh_token') token: string,
  ): Promise<Pick<AuthResponse, 'access_token'>> {
    return await this.authService.refresh(token);
  }
}
