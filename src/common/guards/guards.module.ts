import { AccessModule } from '#auth/access.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [AccessModule, ConfigModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class GuardsModule {}
