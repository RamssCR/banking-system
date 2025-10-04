import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  SingleAccountOperationDto,
  TransferenceDto,
} from './dto/create-transaction.dto';
import { Pagination } from '#types/pagination';
import { Transaction } from './entities/transaction.entity';
import { TransactionPaginationDto } from '#common/dtos/pagination.dto';
import { TransactionsService } from './transactions.service';
import { User } from '#common/decorators/user.decorator';

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

  @Post('withdraw')
  async withdraw(
    @User('sub') userId: number,
    @Body() withdrawDto: SingleAccountOperationDto,
  ): Promise<Transaction> {
    return await this.transactionsService.withdraw(userId, withdrawDto);
  }

  @Post('transfer')
  async transfer(
    @User('sub') userId: number,
    @Body() transferDto: TransferenceDto,
  ): Promise<Transaction> {
    return await this.transactionsService.transfer(userId, transferDto);
  }
}
