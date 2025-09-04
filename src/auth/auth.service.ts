import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '#users/users.service';
import bcrypt from 'bcryptjs';
import { handleDBError } from '#common/helpers/handleDBErrors.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.findOneByEmail(dto.email);
      const isValidPassword = await bcrypt.compare(dto.password, user.password);

      if (!isValidPassword)
        throw new BadRequestException('Incorrect user or password');

      const payload: JwtPayload = {
        sub: user.id,
        username: user.username,
        role: user.role.name,
      };
      return { access_token: await this.jwtService.signAsync(payload) };
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while trying to sign you in',
      );
    }
  }

  async signUp(dto: SignUpDto): Promise<{ access_token: string }> {
    const { passwordConfirmation, ...user } = dto;
    if (user.password !== passwordConfirmation)
      throw new BadRequestException('Passwords do not match.');

    try {
      const createduUser = await this.userService.create(dto);

      const payload: JwtPayload = {
        sub: createduUser.id,
        username: createduUser.username,
        role: createduUser.role.name,
      };
      return { access_token: await this.jwtService.signAsync(payload) };
    } catch (error) {
      throw handleDBError(
        error,
        'An error occured while trying to sign you up',
      );
    }
  }
}
