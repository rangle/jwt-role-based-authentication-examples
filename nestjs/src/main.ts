import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { RolesGuard } from './module/auth/guard/role.guard';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.CLIENT_ORIGIN },
  });

  app.use(helmet());
  app.use(cookieParser());

  await app.listen(PORT);
}
bootstrap();
