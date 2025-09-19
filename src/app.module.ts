import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { InterceptorsModule } from './common/interceptors/interceptors.module';
import { Module } from '@nestjs/common';
import { PipesModule } from '#common/pipes/pipes.module';
import { RolesModule } from './roles/roles.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,
    DatabaseModule,
    InterceptorsModule,
    PipesModule,
    RolesModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
