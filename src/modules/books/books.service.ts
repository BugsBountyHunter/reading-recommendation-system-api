import { IPaginationMeta, IResponse } from '@app/common/utils/iresponse';
import { BookFilterDto } from '@app/modules/books/dto/book-filter.dto';
import { CreateBookDto } from '@app/modules/books/dto/create-book.dto';
import { Book } from '@app/modules/books/entities/book.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
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
}
