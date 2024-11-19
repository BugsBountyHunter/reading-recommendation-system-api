import { IPaginationMeta, IResponse } from '@app/common/utils/iresponse';
import { BookFilterDto } from '@app/modules/books/dto/book-filter.dto';
import { CreateBookDto } from '@app/modules/books/dto/create-book.dto';
import { Book } from '@app/modules/books/entities/book.entity';
import {
  Top5BookResponse,
  Top5Books,
} from '@app/modules/books/interfaces/top-5-books.interface';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(ReadingInterval)
    private readonly readingIntervalRepository: Repository<ReadingInterval>,
  ) {}
  async create(createBookDto: CreateBookDto) {
    const created = await this.bookRepository.save(createBookDto);
    return <IResponse<Book>>{
      data: created,
      message: 'Book created successfully',
    };
  }

  async findAll({ page, limit, ...bookFilterDto }: BookFilterDto) {
    const skip = (page - 1) * limit;
    const [books, totalItems] = await this.bookRepository.findAndCount({
      where: {
        name: bookFilterDto.name,
        numberOfPages: bookFilterDto.numberOfPages,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);
    const meta: IPaginationMeta = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
    };
    return <IResponse<Book[]>>{
      data: books,
      meta: meta,
      message: 'Books retrieved successfully',
    };
  }

  async delete(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      return <IResponse<Book>>{
        errors: 'Book not found',
      };
    }
    await this.bookRepository.delete(id);

    return <IResponse<Book>>{
      data: book,
      message: 'Book deleted successfully',
    };
  }

  async pickTop5Books() {
    const top5Books = await this.readingIntervalRepository
      .createQueryBuilder('reading_intervals')
      .select('reading_intervals.book_id', 'bookId')
      .addSelect(
        `SUM(reading_intervals.end_page - reading_intervals.start_page + 1)`,
        'uniquePages',
      )
      .innerJoin(Book, 'book', 'book.id = reading_intervals.book_id')
      .where('book.deleted_at IS NULL')
      .groupBy('reading_intervals.book_id')
      .orderBy(
        'SUM(reading_intervals.end_page - reading_intervals.start_page + 1)',
        'DESC',
      )
      .limit(5)
      .getRawMany<Top5Books>();
    const books = await Promise.all(
      top5Books.map(async (topBook) => {
        const book = await this.bookRepository.findOne({
          where: { id: topBook.bookId },
        });
        return <Top5BookResponse>{
          bookId: book.id,
          bookName: book.name,
          numOfPages: book.numberOfPages,
          numOfReadPages: +topBook.uniquePages,
        };
      }),
    );
    return <IResponse<Top5BookResponse[]>>{
      data: books.filter((book) => book !== null),
    };
  }
}
