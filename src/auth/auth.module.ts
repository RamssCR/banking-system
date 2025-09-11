import { AccessModule } from '#auth/access.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GuardsModule } from '#common/guards/guards.module';
import { Module } from '@nestjs/common';
import { RefreshModule } from '#auth/refresh.module';
import { UsersModule } from '#users/users.module';

@Module({
  imports: [AccessModule, GuardsModule, RefreshModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
