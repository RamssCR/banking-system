import { AccountsModule } from '#accounts/accounts.module';
import { Module } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '#users/users.module';

@Module({
  imports: [
    UsersModule,
    AccountsModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TypeOrmModule],
})
export class TransactionsModule {}
