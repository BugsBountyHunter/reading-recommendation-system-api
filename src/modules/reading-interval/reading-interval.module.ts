import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingIntervalService } from '@app/modules/reading-interval/reading-interval.service';
import { ReadingIntervalController } from '@app/modules/reading-interval/reading-interval.controller';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';
import { Book } from '@app/modules/books/entities/book.entity';
import { AuthModule } from '@app/modules/auth/auth.module';
import { UsersModule } from '@app/modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([ReadingInterval, Book]),
  ],
  controllers: [ReadingIntervalController],
  providers: [ReadingIntervalService],
})
export class ReadingIntervalModule {}
