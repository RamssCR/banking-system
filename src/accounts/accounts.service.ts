import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from '#types/pagination';
import { Repository } from 'typeorm';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UsersService } from '#users/users.service';
import { generateAccountNumber } from '#common/helpers/luhnChecksum';
import { handleDBError } from '#common/helpers/handleDBErrors';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    id: number,
  ): Promise<Pagination<Account[]>> {
    const [data, total] = await this.accountRepository.findAndCount({
      where: { user: { id } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['transactionsTo', 'transactionsFrom'],
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, userId: number): Promise<Account> {
    try {
      return await this.accountRepository.findOneOrFail({
        where: { id, user: { id: userId } },
        relations: ['transactionsTo', 'transactionsFrom'],
      });
    } catch (error) {
      throw handleDBError(error, 'An error occurred while getting the account');
    }
  }

  async create(id: number): Promise<Account> {
    try {
      const user = await this.usersService.findOne(id);

      let accountNumber: string;
      let existing: Account | null;

      do {
        accountNumber = generateAccountNumber();
        existing = await this.findByAccountNumber(accountNumber);
      } while (existing);

      const account = this.accountRepository.create({ accountNumber, user });
      return await this.accountRepository.save(account);
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while creating the account',
      );
    }
  }

  async restore(id: number): Promise<void> {
    try {
      const result = await this.accountRepository.restore(id);
      if (result.affected === 0)
        throw new InternalServerErrorException(
          'An error occurred during account restoration',
        );
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred during account restoration',
      );
    }
  }

  async update(
    id: number,
    userId: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    try {
      const account = await this.findOne(id, userId);
      await this.accountRepository.update({ id: account.id }, updateAccountDto);
      return await this.findOne(id, userId);
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while updating the account',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.accountRepository.softDelete(id);
      if (result.affected === 0)
        throw new NotFoundException('Account was already deleted');
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while deleting the account',
      );
    }
  }

  private async findByAccountNumber(
    accountNumber: string,
  ): Promise<Account | null> {
    try {
      return await this.accountRepository.findOne({
        where: { accountNumber },
        relations: ['transactionsTo', 'transactionsFrom'],
      });
    } catch (error) {
      throw handleDBError(error, 'An error occurred while getting the account');
    }
  }
}
