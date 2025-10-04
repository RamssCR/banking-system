import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  SingleAccountOperationDto,
  TransferenceDto,
} from './dto/create-transaction.dto';
import { Account } from '#accounts/entities/account.entity';
import { DatabaseTransactionService } from '#database/database-transaction.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from '#types/pagination';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from '#users/entities/user.entity';
import { UsersService } from '#users/users.service';
import { handleDBError } from '#common/helpers/handleDBErrors';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
    private readonly dbTransactionService: DatabaseTransactionService,
  ) {}

  async findAll(
    accountNumber: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<Transaction[]>> {
    const [data, total] = await this.transactionRepository.findAndCount({
      where: [
        { sourceAccount: { accountNumber } },
        { destinationAccount: { accountNumber } },
      ],
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
          if (!account) throw new NotFoundException('Account not found');
          const user = await this.getUser(userId);

          account.balance += depositDto.amount;
          await queryRunner.manager.save(account);

          const transaction = this.transactionRepository.create({
            amount: depositDto.amount,
            type: 'deposit',
            destinationAccount: account,
            performedBy: user,
            status: 'completed',
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

  async withdraw(
    userId: number,
    withdrawDto: SingleAccountOperationDto,
  ): Promise<Transaction> {
    return this.dbTransactionService.execute<Transaction>(
      async (queryRunner) => {
        try {
          const account = await queryRunner.manager.findOne(Account, {
            where: { accountNumber: withdrawDto.accountNumber },
            lock: { mode: 'pessimistic_write' },
          });
          if (!account) throw new NotFoundException('Account not found');
          const user = await this.getUser(userId);

          if (account.balance < withdrawDto.amount)
            throw new BadRequestException(
              'Insufficient funds for withdrawal operation',
            );

          account.balance -= withdrawDto.amount;
          await queryRunner.manager.save(account);

          const transaction = this.transactionRepository.create({
            amount: withdrawDto.amount,
            type: 'withdraw',
            sourceAccount: account,
            performedBy: user,
            status: 'completed',
          });

          return await queryRunner.manager.save(transaction);
        } catch (error) {
          throw handleDBError(error, 'An error occurred during withdrawal');
        }
      },
    );
  }

  async transfer(
    userId: number,
    tranferDto: TransferenceDto,
  ): Promise<Transaction> {
    return await this.dbTransactionService.execute<Transaction>(
      async (queryRunner) => {
        try {
          const sourceAccount = await queryRunner.manager.findOne(Account, {
            where: { accountNumber: tranferDto.sourceAccountNumber },
            lock: { mode: 'pessimistic_write' },
          });
          const destinationAccount = await queryRunner.manager.findOne(
            Account,
            {
              where: { accountNumber: tranferDto.destinationAccountNumber },
              lock: { mode: 'pessimistic_write' },
            },
          );

          if (!sourceAccount || !destinationAccount)
            throw new NotFoundException('One of the accounts was not found');

          if (sourceAccount.accountNumber === destinationAccount.accountNumber)
            throw new BadRequestException(
              'Cannot perform tranfer operation to the same account',
            );

          if (sourceAccount.balance < tranferDto.amount)
            throw new BadRequestException(
              'Insufficient funds for transference operation',
            );

          const user = await this.getUser(userId);

          sourceAccount.balance -= tranferDto.amount;
          destinationAccount.balance += tranferDto.amount;
          await queryRunner.manager.save([sourceAccount, destinationAccount]);

          const transaction = this.transactionRepository.create({
            amount: tranferDto.amount,
            type: 'transfer',
            sourceAccount,
            destinationAccount,
            performedBy: user,
            status: 'completed',
          });

          return await queryRunner.manager.save(transaction);
        } catch (error) {
          throw handleDBError(error, 'An error occurred during transference');
        }
      },
    );
  }

  private async getUser(id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }
}
