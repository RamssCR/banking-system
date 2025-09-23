import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Pagination } from '#types/pagination';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { handleDBError } from '#common/helpers/handleDBErrors.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(
    accountNumber: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<Transaction[]>> {
    const [data, total] = await this.transactionRepository.findAndCount({
      where: { sourceAccount: { accountNumber } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      page,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Transaction> {
    try {
      return await this.transactionRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while getting the transaction',
      );
    }
  }

  create(createTransactionDto: CreateTransactionDto) {
    console.log(createTransactionDto);
    return 'This action adds a new transaction';
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    console.log(updateTransactionDto);
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
