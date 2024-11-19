import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '@app/modules/books/books.service';
import { Repository } from 'typeorm';
import { Book } from '@app/modules/books/entities/book.entity';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBookDto } from '@app/modules/books/dto/create-book.dto';
import { BookFilterDto } from '@app/modules/books/dto/book-filter.dto';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;
  let readingIntervalRepository: Repository<ReadingInterval>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ReadingInterval),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getRawMany: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    readingIntervalRepository = module.get<Repository<ReadingInterval>>(
      getRepositoryToken(ReadingInterval),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book and return it', async () => {
      const createBookDto: CreateBookDto = {
        name: 'Test Book',
        numberOfPages: 100,
      };
      const savedBook: Book = {
        id: '1',
        ...createBookDto,
        readingIntervals: [],
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      };
      jest.spyOn(bookRepository, 'save').mockResolvedValue(savedBook);

      const result = await service.create(createBookDto);

      expect(result).toEqual({
        data: savedBook,
        message: 'Book created successfully',
      });
      expect(bookRepository.save).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const bookFilterDto: BookFilterDto = {
        page: 1,
        limit: 2,
        name: 'Test Book',
        numberOfPages: 100,
      };
      const books: Book[] = [
        {
          id: '1',
          name: 'Test Book',
          numberOfPages: 100,
          readingIntervals: [],
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
      ];
      jest.spyOn(bookRepository, 'findAndCount').mockResolvedValue([books, 1]);

      const result = await service.findAll(bookFilterDto);

      expect(result).toEqual({
        data: books,
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 2,
        },
        message: 'Books retrieved successfully',
      });
      expect(bookRepository.findAndCount).toHaveBeenCalledWith({
        where: { name: 'Test Book', numberOfPages: 100 },
        skip: 0,
        take: 2,
      });
    });
  });

  describe('delete', () => {
    it('should delete a book if found', async () => {
      const book: Book = {
        id: '1',
        name: 'Test Book',
        numberOfPages: 100,
        readingIntervals: [],
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      };
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(book);
      jest.spyOn(bookRepository, 'delete').mockResolvedValue(undefined);

      const result = await service.delete('1');

      expect(result).toEqual({
        data: book,
        message: 'Book deleted successfully',
      });
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(bookRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should return an error if book is not found', async () => {
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      const result = await service.delete('1');

      expect(result).toEqual({
        errors: 'Book not found',
      });
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  it('should return an empty array if no top books are found', async () => {
    jest
      .spyOn(readingIntervalRepository, 'createQueryBuilder')
      .mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]), // Simulate no results
      } as any);

    const result = await service.pickTop5Books();

    expect(result).toEqual({ data: [] });
  });
});
