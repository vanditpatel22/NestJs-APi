import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    const PORT = process.env.PORT ?? 3000;

    await app.listen(PORT);

    console.info(`🚀🚀 Server is running on ${PORT}`);

  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }

}
bootstrap();
