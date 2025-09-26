import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Account } from '#accounts/entities/account.entity';
import { BaseEntity } from '#common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { User } from '#users/entities/user.entity';

export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'reverse';
export type TransactionStatus =
  | 'pending'
  | 'failed'
  | 'completed'
  | 'reversed'
  | 'cancelled';

@Entity()
export class Transaction extends BaseEntity {
  @Column({ type: 'float', default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: ['deposit', 'withdraw', 'transfer'] })
  type: TransactionType;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'failed', 'completed', 'reversed', 'cancelled'],
    default: 'pending',
  })
  status: TransactionStatus;

  @ManyToOne(() => Account, (account) => account.transactionsFrom, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  sourceAccount: Account;

  @ManyToOne(() => Account, (account) => account.transactionsTo, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  destinationAccount: Account;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @Exclude()
  performedBy: User;

  @ManyToOne(() => Transaction, (transaction) => transaction.reversals, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Exclude()
  referenceTo: Transaction;

  @OneToMany(() => Transaction, (transaction) => transaction.referenceTo)
  @Exclude()
  reversals: Transaction[];
}
