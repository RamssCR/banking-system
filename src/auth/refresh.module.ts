import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: false,
        secret: config.get<string>('JWT_REFRESH_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    {
      provide: 'JWT_REFRESH_SERVICE',
      useExisting: JwtService,
    },
  ],
  exports: ['JWT_REFRESH_SERVICE'],
})
export class RefreshModule {}
