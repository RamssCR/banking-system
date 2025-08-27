import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule],
})
export class AppModule {}
