import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '@app/modules/books/books.controller';
import { BooksService } from '@app/modules/books/books.service';
import { CreateBookDto } from '@app/modules/books/dto/create-book.dto';
import { BookFilterDto } from '@app/modules/books/dto/book-filter.dto';
import { JwtGuard } from '@app/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@app/modules/auth/guard/role.guard';

describe('BooksController', () => {
  let booksController: BooksController;
  let booksService: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    pickTop5Books: jest.fn(),
  };
  const mockJwtGuard = { canActivate: jest.fn(() => true) };
  const mockRoleGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockBooksService }],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .overrideGuard(RoleGuard)
      .useValue(mockRoleGuard)
      .compile();

    booksController = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(booksController).toBeDefined();
  });

  describe('create', () => {
    it('should create a book and return it', async () => {
      const createBookDto: CreateBookDto = {
        name: 'Test Book',
        numberOfPages: 100,
      };
      const createdBook = {
        id: '1',
        name: 'Test Book',
        numberOfPages: 100,
      };
      mockBooksService.create.mockResolvedValue({ data: createdBook });

      const result = await booksController.create(createBookDto);

      expect(result).toEqual({ data: createdBook });
      expect(booksService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return a list of books', async () => {
      const bookFilterDto: BookFilterDto = {
        page: 1,
        limit: 10,
      };
      const books = [
        {
          id: '1',
          name: 'Book 1',
          numberOfPages: 100,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
          readingIntervals: [],
        },
        {
          id: '2',
          name: 'Book 2',
          numberOfPages: 200,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
          readingIntervals: [],
        },
      ];
      mockBooksService.findAll.mockResolvedValue({ data: books });

      const result = await booksController.findAll(bookFilterDto);

      expect(result).toEqual({ data: books });
      expect(booksService.findAll).toHaveBeenCalledWith(bookFilterDto);
    });
  });

  describe('remove', () => {
    it('should delete a book by ID', async () => {
      const bookId = '1';
      const result = { message: 'Book successfully deleted' };

      jest.spyOn(booksService, 'delete').mockResolvedValue(result);

      expect(await booksController.remove(bookId)).toEqual(result);
      expect(booksService.delete).toHaveBeenCalledWith(bookId);
    });
  });

  describe('getTop5Books', () => {
    it('should call bookService.pickTop5Books and return Top5BookResponse objects', async () => {
      const top5Books = [
        {
          bookId: '1',
          bookName: 'Book Name 1',
          numOfPages: 100,
          numOfReadPages: 50,
        },
        {
          bookId: '2',
          bookName: 'Book Name 2',
          numOfPages: 150,
          numOfReadPages: 75,
        },
      ];
      const expectedResponse = [
        {
          bookId: '1',
          bookName: 'Book Name 1',
          numOfPages: 100,
          numOfReadPages: 50,
        },
        {
          bookId: '2',
          bookName: 'Book Name 2',
          numOfPages: 150,
          numOfReadPages: 75,
        },
      ];

      mockBooksService.pickTop5Books.mockResolvedValue(top5Books);

      const result = await booksController.getTop5Books();

      expect(booksService.pickTop5Books).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });
});
