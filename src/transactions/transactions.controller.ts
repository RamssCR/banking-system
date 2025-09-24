import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Pagination } from '#types/pagination';
import { Transaction } from './entities/transaction.entity';
import { TransactionPaginationDto } from '#common/dtos/pagination.dto';
import { TransactionsService } from './transactions.service';
import { SingleAccountOperationDto } from './dto/create-transaction.dto';
import { User } from '#common/decorators/user.decorator.js';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(
    @Query() { accountNumber, page, limit }: TransactionPaginationDto,
  ): Promise<Pagination<Transaction[]>> {
    return await this.transactionsService.findAll(accountNumber, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Transaction> {
    return await this.transactionsService.findOne(id);
  }

  @Post('deposit')
  async deposit(
    @User('sub') userId: number,
    @Body() depositDto: SingleAccountOperationDto,
  ): Promise<Transaction> {
    return await this.transactionsService.deposit(userId, depositDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
