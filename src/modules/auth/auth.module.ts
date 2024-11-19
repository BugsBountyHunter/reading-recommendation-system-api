import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@app/modules/users/entities/user.entity';
import { UsersModule } from '@app/modules/users/users.module';
import { RegisterMiddleware } from '@app/modules/auth/middlewares/register.middleware';
import { LoginMiddleware } from '@app/modules/auth/middlewares/login.middleware';
import { AuthService } from '@app/modules/auth/auth.service';
import { AuthController } from '@app/modules/auth/auth.controller';
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('auth.secret'),
        signOptions: {
          expiresIn: config.get<string>('auth.expiresIn'),
          audience: config.get<string>('auth.audience'),
          issuer: config.get<string>('auth.issuer'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RegisterMiddleware)
      .forRoutes({ path: 'v1/auth/register', method: RequestMethod.POST });

    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: 'v1/auth/login', method: RequestMethod.POST });
  }
}
