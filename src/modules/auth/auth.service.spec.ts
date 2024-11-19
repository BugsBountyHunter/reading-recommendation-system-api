import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@app/modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@app/modules/users/users.service';
import { LoginDto } from '@app/modules/auth/dto/login.dto';
import { UserRole } from '@app/modules/users/enums/role.enum';
import { generateHashPassword } from '@app/common/utils/hash-password.utils';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from '@app/modules/users/dto/user-response.dto';
import { BadRequestException } from '@nestjs/common';
import { RegisterDto } from '@app/modules/auth/dto/register.dto';
import { User } from '@app/modules/users/entities/user.entity';
jest.mock('@app/common/utils/hash-password.utils');

describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('login', () => {
    it('should return a valid login response if credentials are correct', async () => {
      const loginDto: LoginDto = {
        user: {
          id: '1',
          password: 'hashedPassword',
          username: 'testuser',
          role: UserRole.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        username: 'testuser',
        password: 'plainPassword',
      };

      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'auth.salt') return 'testSalt';
        if (key === 'auth.expiresIn') return '3600';
      });

      (generateHashPassword as jest.Mock).mockReturnValue('hashedPassword');
      jest.spyOn(authService, 'generateToken').mockResolvedValue('testToken');

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        data: {
          user: plainToInstance(UserResponse, loginDto.user),
          accessToken: 'testToken',
          expiresIn: '3600',
        },
      });
    });
    it('should throw BadRequestException if credentials are incorrect', async () => {
      const loginDto: LoginDto = {
        user: {
          id: '1',
          password: 'wrongPassword',
          username: 'testuser',
          role: UserRole.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        username: 'testuser',
        password: 'plainPassword',
      };

      jest.spyOn(configService, 'get').mockReturnValue('testSalt');
      (generateHashPassword as jest.Mock).mockReturnValue('hashedPassword');

      await expect(authService.login(loginDto)).rejects.toThrow(
        new BadRequestException('Invalid Credentials'),
      );
    });
  });

  describe('register', () => {
    it('should return a valid register response', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        password: 'plainPassword',
        role: UserRole.USER,
      };

      const mockCreatedUser: User = {
        id: '1',
        username: 'testuser',
        password: 'hashedPassword',
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(configService, 'get').mockReturnValue('3600');
      jest.spyOn(usersService, 'create').mockResolvedValue(mockCreatedUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('testToken');

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        user: plainToInstance(UserResponse, mockCreatedUser),
        accessToken: 'testToken',
        expiresIn: '3600',
        message: 'Successfully Create User',
      });
    });
  });
});
