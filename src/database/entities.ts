import { Account } from '#accounts/entities/account.entity';
import { Role } from '#roles/entities/role.entity';
import { Transaction } from '#transactions/entities/transaction.entity';
import { User } from '#users/entities/user.entity';

export const entities = [User, Role, Account, Transaction];
