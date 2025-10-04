import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_REFRESH } from '#common/helpers/constants';
import { Module } from '@nestjs/common';

@Module({
  imports: [JwtModule],
  providers: [
    {
      provide: JWT_REFRESH,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new JwtService({
          secret: config.get<string>('JWT_REFRESH_SECRET'),
          signOptions: { expiresIn: '7d' },
        }),
    },
  ],
  exports: [JWT_REFRESH],
})
export class RefreshModule {}
