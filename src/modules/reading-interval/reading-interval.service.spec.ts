import { Test, TestingModule } from '@nestjs/testing';
import { ReadingIntervalService } from '@app/modules/reading-interval/reading-interval.service';
import { Repository } from 'typeorm';
import { Book } from '@app/modules/books/entities/book.entity';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';
import { CreateReadingIntervalDto } from '@app/modules/reading-interval/dto/create-reading-interval.dto';
import { User } from '@app/modules/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IResponse } from '@app/common/utils/iresponse';
import { UserRole } from '@app/modules/users/enums/role.enum';

describe('ReadingIntervalService', () => {
  let service: ReadingIntervalService;
  let bookRepository: Repository<Book>;
  let readingIntervalRepository: Repository<ReadingInterval>;

  const mockBook: Book = {
    id: '1',
    numberOfPages: 200,
    name: 'Test Book',
    readingIntervals: [],
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
  };

  const mockReadingInterval: ReadingInterval = {
    id: '1',
    startPage: 1,
    endPage: 50,
    book: mockBook,
    user: {
      id: '',
      readingIntervals: [],
      username: '',
      password: '',
      role: UserRole.USER,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    },
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
  };

  const mockCreateReadingIntervalDto: CreateReadingIntervalDto = {
    startPage: 1,
    endPage: 50,
    bookId: '1',
  };

  const mockUser = new User();
  mockUser.username = 'testUser';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingIntervalService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockBook),
          },
        },
        {
          provide: getRepositoryToken(ReadingInterval),
          useValue: {
            create: jest.fn().mockReturnValue(mockReadingInterval),
            save: jest.fn().mockResolvedValue(mockReadingInterval),
          },
        },
      ],
    }).compile();

    service = module.get<ReadingIntervalService>(ReadingIntervalService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    readingIntervalRepository = module.get<Repository<ReadingInterval>>(
      getRepositoryToken(ReadingInterval),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should throw NotFoundException if book does not exist', async () => {
    jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(
      service.create(mockUser, {
        bookId: 999,
        ...mockCreateReadingIntervalDto,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if endPage is greater than book pages', async () => {
    const invalidDto = { ...mockCreateReadingIntervalDto, endPage: 201 };

    await expect(
      service.create(mockUser, { bookId: mockBook.id, ...invalidDto }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create and return a reading interval', async () => {
    const result = await service.create(mockUser, {
      bookId: mockBook.id,
      ...mockCreateReadingIntervalDto,
    });

    expect(result).toEqual<IResponse<ReadingInterval>>({
      data: mockReadingInterval,
      message: 'Successfully create reading interval',
    });

    expect(readingIntervalRepository.save).toHaveBeenCalledWith(
      mockReadingInterval,
    );
  });
});
