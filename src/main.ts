import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.set('query parser', 'extended');
  await app.listen(configService.get('PORT') ?? 3000);
  console.log(`App running on port ${await app.getUrl()}`);
};

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
