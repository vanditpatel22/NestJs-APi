import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { httpLogger } from './logger/winston.logger';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useStaticAssets(join(__dirname, '..', 'uploads')); // Serve /uploads as public

    app.useGlobalPipes(new ValidationPipe());
    const PORT = process.env.PORT ?? 3000;

    app.use(httpLogger);

    await app.listen(PORT);

    console.info(`🚀🚀 Server is running on ${PORT}`);

  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }

}
bootstrap();
