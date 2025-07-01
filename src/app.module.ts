import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ResponseUtil } from './common/utils/response.util';
import { CommonModule } from './common/common.module';
import { ApiKeyMiddleware } from './common/middleware/api-key.middleware';


@Module({
  imports: [TodosModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService, ResponseUtil],
  exports: [ResponseUtil]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware,ApiKeyMiddleware)
      .forRoutes('*'); // Apply to all routes, or list specific routes here
  }
}