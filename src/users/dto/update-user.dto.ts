import { CreateUserDto } from './create-user.dto';
import { IsInt, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsInt()
  roleId?: number;
}
