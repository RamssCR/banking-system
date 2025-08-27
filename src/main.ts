import { AppModule } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');
  await app.listen(process.env.PORT ?? 3000);
};

await bootstrap();
