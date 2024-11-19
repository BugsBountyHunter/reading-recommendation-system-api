import { Module } from '@nestjs/common';
import { BooksController } from '@app/modules/books/books.controller';
import { BooksService } from '@app/modules/books/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@app/modules/books/entities/book.entity';
import { AuthModule } from '@app/modules/auth/auth.module';
import { UsersModule } from '@app/modules/users/users.module';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Book, ReadingInterval]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
