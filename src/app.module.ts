import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { configuration } from '@app/config/configuration';
import pinoConfig from '@app/config/pino.logger.config';
import { typeOrmModuleOptions } from '@app/config/orm.config';
import { validate } from '@app/config/env.validation';
import { GlobalExceptionFilter } from '@app/common/filters/global-exception.filter';
import { UsersModule } from '@app/modules/users/users.module';
import { AuthModule } from '@app/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validate }),
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => pinoConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [
        {
          ttl: configService.get<number>('rateLimit.ttl', 60),
          limit: configService.get<number>('rateLimit.limit', 10),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...typeOrmModuleOptions,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
