import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@app/modules/users/users.service';
import { Repository } from 'typeorm';
import { User } from '@app/modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { generateHashPassword } from '@app/common/utils/hash-password.utils';
import { CreateUserDto } from '@app/modules/users/dto/create-user.dto';
import { UserRole } from '@app/modules/users/enums/role.enum';

jest.mock('@app/common/utils/hash-password.utils');
describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let configService: ConfigService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        role: UserRole.USER,
      };
      const hashedPassword = 'hashedpassword123';
      const salt = 'randomSalt';
      const userEntity = {
        id: '1',
        ...createUserDto,
        password: hashedPassword,
      };

      mockConfigService.get.mockReturnValue(salt);
      (generateHashPassword as jest.Mock).mockReturnValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(userEntity);
      mockUserRepository.save.mockResolvedValue(userEntity);

      const result = await service.create(createUserDto);

      expect(mockConfigService.get).toHaveBeenCalledWith('auth.salt');
      expect(generateHashPassword).toHaveBeenCalledWith(
        createUserDto.password,
        salt,
      );
      expect(result).toEqual({
        id: '1',
        username: 'testuser',
        password: 'hashedpassword123',
        role: UserRole.USER,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...userEntity,
        password: hashedPassword,
      });
      expect(result).toEqual(userEntity);
    });
  });
  describe('findOneById', () => {
    it('should return a user if found', async () => {
      const userId = '1';
      const user: User = {
        id: userId,
        username: 'testuser',
        password: 'hashedpassword123',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneById(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      const userId = '1';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneById(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should return a user when found by ID', async () => {
      const user = { id: '1', username: 'testuser' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneById('1');
      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );
      await expect(service.findOneById('1')).rejects.toThrow();
    });
  });
  describe('findOneByUsername', () => {
    it('should return a user when found by username', async () => {
      const user = { id: '1', username: 'testuser' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneByUsername('testuser');
      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });
  });
  describe('find', () => {
    it('should return user data if found', async () => {
      const user = {
        id: '1',
        username: 'testuser',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.find('1');

      expect(result).toEqual({ data: user });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          username: true,
          role: true,
          password: false,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.find('1')).rejects.toThrow(NotFoundException);
    });
  });
});
