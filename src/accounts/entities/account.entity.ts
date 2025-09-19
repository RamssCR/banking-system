import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity';
import { Transaction } from '#transactions/entities/transaction.entity';
import { User } from '#users/entities/user.entity';

@Entity()
export class Account extends BaseEntity {
  @Column({ type: 'varchar', length: 11, unique: true })
  accountNumber: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.sourceAccount)
  transactionsFrom: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.destinationAccount)
  transactionsTo: Transaction[];

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  user: User;
}
