import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { InterceptorsModule } from './common/interceptors/interceptors.module';
import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PipesModule } from '#common/pipes/pipes.module';

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
  ],
})
export class AppModule {}
