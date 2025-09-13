import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '#common/decorators/match.decorator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Match<SignUpDto>('password', { message: 'Passwords do not match' })
  passwordConfirmation: string;
}
