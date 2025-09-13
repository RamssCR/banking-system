import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './interfaces/auth-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { REFRESH_TOKEN_SALT_ROUNDS } from '#common/helpers/constants';
import { UsersService } from '#users/users.service';
import bcrypt from 'bcryptjs';
import { handleDBError } from '#common/helpers/handleDBErrors';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('JWT_REFRESH_SERVICE')
    private readonly jwtRefresh: JwtService,
  ) {}

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    try {
      const user = await this.userService.findOneByEmail(dto.email);
      const isValidPassword = await bcrypt.compare(dto.password, user.password);

      if (!isValidPassword)
        throw new BadRequestException('Incorrect user or password');

      const payload: JwtPayload = { sub: user.id, role: user.role.name };
      const refreshToken = await this.jwtRefresh.signAsync(payload);
      const refreshHash = await bcrypt.hash(
        refreshToken,
        REFRESH_TOKEN_SALT_ROUNDS,
      );

      await this.userService.setRefreshToken(user.id, refreshHash);

      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: refreshToken,
        user,
      };
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while trying to sign you in',
      );
    }
  }

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const { passwordConfirmation: _password, ...user } = dto;
    try {
      const createdUser = await this.userService.create(user);
      const payload: JwtPayload = {
        sub: createdUser.id,
        role: createdUser.role.name,
      };

      const refreshToken = await this.jwtRefresh.signAsync(payload);
      const refreshHash = await bcrypt.hash(
        refreshToken,
        REFRESH_TOKEN_SALT_ROUNDS,
      );

      await this.userService.setRefreshToken(createdUser.id, refreshHash);

      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: refreshToken,
        user: createdUser,
      };
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while trying to sign you up',
      );
    }
  }

  async refresh(token: string): Promise<Pick<AuthResponse, 'access_token'>> {
    try {
      const payload = await this.jwtRefresh.verifyAsync<JwtPayload>(token);
      const isValid = await this.userService.validateRefreshToken(
        payload.sub,
        token,
      );

      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const newPayload: JwtPayload = { ...payload };
      const newAccess = await this.jwtService.signAsync(newPayload);
      return { access_token: newAccess };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async signOut(userId: number): Promise<void> {
    await this.userService.removeRefreshToken(userId);
  }
}
