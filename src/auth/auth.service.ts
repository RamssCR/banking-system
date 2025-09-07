import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthResponse } from './interfaces/auth-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
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

      const payload: JwtPayload = { sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: await this.jwtRefresh.signAsync(payload),
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
      const createduUser = await this.userService.create(user);
      const payload: JwtPayload = { sub: createduUser.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: await this.jwtRefresh.signAsync(payload),
        user: createduUser,
      };
    } catch (error) {
      throw handleDBError(
        error,
        'An error occured while trying to sign you up',
      );
    }
  }
}
