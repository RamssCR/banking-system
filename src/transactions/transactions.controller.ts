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
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Pagination } from '#types/pagination';
import { Transaction } from './entities/transaction.entity';
import { TransactionPaginationDto } from '#common/dtos/pagination.dto';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

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

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
