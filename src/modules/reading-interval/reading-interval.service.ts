import { IResponse } from '@app/common/utils/iresponse';
import { Book } from '@app/modules/books/entities/book.entity';
import { CreateReadingIntervalDto } from '@app/modules/reading-interval/dto/create-reading-interval.dto';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';
import { User } from '@app/modules/users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReadingIntervalService {
  constructor(
    @InjectRepository(ReadingInterval)
    private readonly readingIntervalRepository: Repository<ReadingInterval>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(
    user: User,
    { bookId, ...createReadingIntervalDto }: CreateReadingIntervalDto,
  ) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`There's no book with this id: ${bookId}`);
    }

    // double check if endPage bigger than bookPages
    if (createReadingIntervalDto.endPage > book.numberOfPages) {
      throw new BadRequestException(`EndPage can't be more than te book pages`);
    }

    const readingInterval = this.readingIntervalRepository.create({
      ...createReadingIntervalDto,
    });

    readingInterval.book = book;
    readingInterval.user = user;
    const createdReadingInterval =
      await this.readingIntervalRepository.save(readingInterval);

    return <IResponse<ReadingInterval>>{
      data: createdReadingInterval,
      message: 'Successfully create reading interval',
    };
  }
}
