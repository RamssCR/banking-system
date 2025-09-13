import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '#common/dtos/pagination.dto';
import { Roles } from '#common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin', 'moderator')
  @Get()
  async findAll(@Query() { limit, page }: PaginationDto) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Roles('admin')
  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @Roles('admin')
  @Patch(':id/restore')
  async restore(@Param('id') id: number): Promise<void> {
    return this.usersService.restore(id);
  }

  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
