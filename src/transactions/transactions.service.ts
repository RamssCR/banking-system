import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from '#accounts/entities/account.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from '#types/pagination';
import { Repository } from 'typeorm';
import { SingleAccountOperationDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { UsersService } from '#users/users.service.js';
import { handleDBError } from '#common/helpers/handleDBErrors';
import { User } from '#users/entities/user.entity.js';
import { DatabaseTransactionService } from '#database/database-transaction.service.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly usersService: UsersService,
    private readonly dbTransactionService: DatabaseTransactionService,
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

  async deposit(
    userId: number,
    depositDto: SingleAccountOperationDto,
  ): Promise<Transaction> {
    return this.dbTransactionService.execute<Transaction>(
      async (queryRunner) => {
        try {
          const account = await queryRunner.manager.findOne(Account, {
            where: { accountNumber: depositDto.accountNumber },
            lock: { mode: 'pessimistic_write' },
          });
          if (!account)
            throw new NotFoundException('An error occurred during deposit');

          const user = await this.getUser(userId);

          account.balance += depositDto.amount;
          await queryRunner.manager.save(account);

          const transaction = this.transactionRepository.create({
            amount: depositDto.amount,
            type: 'deposit',
            destinationAccount: account,
            performedBy: user,
          });

          return await queryRunner.manager.save(transaction);
        } catch (error) {
          throw handleDBError(
            error,
            'An error occurred while depositing into your account',
          );
        }
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  private async getUser(id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }
}

/*
  Steps to create a transaction:
  (FIRST) Identify the transaction type to perform (Withdrawal, Tranference, Deposit)

  Deposit: (method)
  1.a. Get the destination account money is gonna be deposited on.
  1.b. Get the amount of money to deposit.
  1.c. Get the user who started the transaction.
  1.d. Update the destination account with the respective amount.

  Withdrawal: (method)
  2.a. Get the destination account money is gonna be withdrawed from.
  2.b. Get the amount of money to withdraw.
  2.c. Validate if the account has the requested amount to withdraw.
  2.d. Get the user who started the transaction.
  2.e. Update the destionation account with the respective amount.

  Transference: (method)
  3.a. Get both the origin account and the destination account.
  3.b. Get the amount of money to transfer.
  3.c. Validate if the origin account has the requested amount to transfer.
  3.d. Get the user who started the transaction.
  4.e. Update both accounts adding the amount to the destination account and substracting it from the origin one.
*/
