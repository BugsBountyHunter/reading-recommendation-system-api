import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from '@app/modules/users/users.controller';
import { UsersService } from '@app/modules/users/users.service';
import { User } from '@app/modules/users/entities/user.entity';
import { AuthModule } from '@app/modules/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
