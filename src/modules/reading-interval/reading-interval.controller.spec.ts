import { Test, TestingModule } from '@nestjs/testing';
import { ReadingIntervalController } from '@app/modules/reading-interval/reading-interval.controller';
import { ReadingIntervalService } from '@app/modules/reading-interval/reading-interval.service';
import { CreateReadingIntervalDto } from '@app/modules/reading-interval/dto/create-reading-interval.dto';
import { UserRole } from '@app/modules/users/enums/role.enum';
import { IResponse } from '@app/common/utils/iresponse';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';
import { User } from '@app/modules/users/entities/user.entity';
import { Book } from '@app/modules/books/entities/book.entity';
import { JwtGuard } from '@app/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@app/modules/auth/guard/role.guard';

describe('ReadingIntervalController', () => {
  let controller: ReadingIntervalController;
  let readingService: ReadingIntervalService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingIntervalController],
      providers: [
        {
          provide: ReadingIntervalService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock JwtGuard
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock RoleGuard
      .compile();

    controller = module.get<ReadingIntervalController>(
      ReadingIntervalController,
    );
    readingService = module.get<ReadingIntervalService>(ReadingIntervalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the create method of ReadingIntervalService with correct parameters', async () => {
      // Arrange
      const user = { id: 'user-id-123', role: UserRole.ADMIN }; // Mock user
      const createReadingIntervalDto: CreateReadingIntervalDto = {
        startPage: 1,
        endPage: 100,
        bookId: 'cfc3a899-3f5d-4c7b-a788-e1d87f029a3f',
      };
      const requestMock = { user } as any; // Mocked Request object
      const expectedResult: IResponse<ReadingInterval> = {
        data: {
          id: 'reading-interval-id-123',
          ...createReadingIntervalDto,
          user: new User(),
          book: new Book(),
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
        message: 'Reading interval created successfully',
      };

      jest.spyOn(readingService, 'create').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(
        createReadingIntervalDto,
        requestMock,
      );

      // Assert
      expect(readingService.create).toHaveBeenCalledWith(
        user,
        createReadingIntervalDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
