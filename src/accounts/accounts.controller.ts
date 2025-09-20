import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Account } from './entities/account.entity';
import { AccountsService } from './accounts.service';
import { Roles } from '#common/decorators/roles.decorator';
import { UpdateAccountDto } from './dto/update-account.dto';
import { User } from '#common/decorators/user.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @Roles('admin', 'moderator')
  async findAll(
    @User('sub') id: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.accountsService.findAll(page, limit, id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @User('sub') userId: number,
  ): Promise<Account> {
    return await this.accountsService.findOne(id, userId);
  }

  @Post()
  async create(@User('sub') id: number): Promise<Account> {
    return await this.accountsService.create(id);
  }

  @Roles('admin')
  @Patch(':id/restore')
  async restore(@Param('id') id: number) {
    return await this.accountsService.restore(id);
  }

  @Roles('admin', 'moderator')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @User('sub') userId: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountsService.update(id, userId, updateAccountDto);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.accountsService.remove(id);
  }
}
