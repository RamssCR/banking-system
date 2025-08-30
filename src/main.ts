import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('query parser', 'extended');
  app.use(helmet());

  const config = app.get(ConfigService);
  await app.listen(config.get('PORT') ?? 3000);
  console.log(`App running on port ${await app.getUrl()}`);
};

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
