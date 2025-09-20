import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_ACCESS } from '#common/helpers/constants';
import { Module } from '@nestjs/common';

@Module({
  imports: [JwtModule],
  providers: [
    {
      provide: JWT_ACCESS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new JwtService({
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        }),
    },
  ],
  exports: [JWT_ACCESS],
})
export class AccessModule {}
