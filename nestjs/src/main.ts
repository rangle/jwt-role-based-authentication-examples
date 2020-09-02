import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as helmet from 'helmet';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.CLIENT_ORIGIN },
  });

  app.use(helmet());

  await app.listen(PORT);
}
bootstrap();
