import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { InterceptorsModule } from './common/interceptors/interceptors.module.js';
import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, RolesModule, DatabaseModule, InterceptorsModule],
})
export class AppModule {}
