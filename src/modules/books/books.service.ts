import { IPaginationMeta, IResponse } from '@app/common/utils/iresponse';
import { BookFilterDto } from '@app/modules/books/dto/book-filter.dto';
import { CreateBookDto } from '@app/modules/books/dto/create-book.dto';
import { Book } from '@app/modules/books/entities/book.entity';
import { Top5BookResponse } from '@app/modules/books/interfaces/top-5-books.interface';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

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
    // Step 1: Fetch all reading intervals grouped by book_id
    const readingIntervals = await this.readingIntervalRepository.find({
      where: { book: { deletedAt: null } },
      relations: { book: true },
      order: { book: { id: 'ASC' } },
    });
    // Step 2: Group intervals by bookId
    const intervalsByBook: Record<string, { start: number; end: number }[]> =
      readingIntervals.reduce((acc, interval) => {
        acc[interval.book.id] = acc[interval.book.id] || [];
        acc[interval.book.id].push({
          start: interval.startPage,
          end: interval.endPage,
        });
        return acc;
      }, {});

    // Step 3: Merge intervals and calculate unique pages for each book
    const mergedIntervalsByBook = Object.entries(intervalsByBook).map(
      ([bookId, intervals]) => {
        const mergedPages = this.mergeIntervals(intervals); // Call merging logic
        return { bookId, uniquePages: mergedPages };
      },
    );
    // Step 4: Sort and select top 5 books by unique pages
    const top5Books = mergedIntervalsByBook
      .sort((a, b) => b.uniquePages - a.uniquePages)
      .slice(0, 5);

    // Step 5: Fetch book details for top 5 books in a single query
    const bookIds = top5Books.map((book) => book.bookId);
    const books = await this.bookRepository.find({
      where: { id: In(bookIds) }, // Fetch all books in one query
    });

    // Step 6: Map results to the final response structure
    const response = top5Books.map((topBook) => {
      const book = books.find((b) => b.id === topBook.bookId);
      if (!book) return null;
      return <Top5BookResponse>{
        bookId: book.id,
        bookName: book.name,
        numOfPages: book.numberOfPages,
        numOfReadPages: +topBook.uniquePages,
      };
    });

    return <IResponse<Top5BookResponse[]>>{
      data: response.filter((book) => book !== null),
    };
  }

  /** explain how it works.
      const intervals = [
      { start: 1, end: 10 },
      { start: 5, end: 15 },
      { start: 20, end: 25 },
      ];
      const merged = mergeIntervals(intervals);
      console.log(merged); // Output: [{ start: 1, end: 15 }, { start: 20, end: 25 }] -> 21
  */
  private mergeIntervals(intervals: { start: number; end: number }[]): number {
    if (!intervals.length) return 0;

    // Step 1: Sort intervals by start page
    intervals.sort((a, b) => a.start - b.start);

    const merged: { start: number; end: number }[] = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      const current = intervals[i];

      if (current.start <= last.end) {
        // Merge intervals
        last.end = Math.max(last.end, current.end);
      } else {
        merged.push(current);
      }
    }

    // Step 2: Calculate total unique pages
    return merged.reduce(
      (sum, interval) => sum + (interval.end - interval.start + 1),
      0,
    );
  }
}
