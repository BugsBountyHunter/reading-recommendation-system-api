import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@app/modules/auth/auth.controller';
import { AuthService } from '@app/modules/auth/auth.service';
import { RegisterDto } from '@app/modules/auth/dto/register.dto';
import { UserRole } from '@app/modules/users/enums/role.enum';
import { IResponse } from '@app/common/utils/iresponse';
import { LoginResponse } from '@app/modules/auth/interfaces/login-response.interface';
import { LoginResponse as RegisterResponse } from '@app/modules/auth/interfaces/login-response.interface';

import { BadRequestException } from '@nestjs/common';
import { LoginDto } from '@app/modules/auth/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;

  // Create mock implementations for AuthService methods
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerDto: RegisterDto = {
        username: 'testUser',
        password: 'testPassword',
        role: UserRole.USER,
      };
      const mockResponse: IResponse<RegisterResponse> = {
        data: {
          user: {
            id: '1',
            username: 'testuser',
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          accessToken: 'accessToken',
          expiresIn: 3600,
        },
        message: 'Successfully Create User',
      };

      // Mock the AuthService's register method to return mockResponse
      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await authController.register(registerDto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw an error when registration fails', async () => {
      const registerDto: RegisterDto = {
        username: 'testUser',
        password: 'testPassword',
        role: UserRole.USER,
      };

      // Simulate an error from the service
      mockAuthService.register.mockRejectedValue(
        new BadRequestException('Registration failed'),
      );

      try {
        await authController.register(registerDto);
      } catch (error) {
        expect(error.response.message).toBe('Registration failed');
      }
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto: LoginDto = {
        username: 'testUser',
        password: 'testPassword',
        user: {
          id: '1',
          username: 'testuser',
          password: 'hashedPassword',
          role: UserRole.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      };
      const mockResponse: IResponse<LoginResponse> = {
        data: {
          user: {
            id: '1',
            username: 'testuser',
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          accessToken: 'accessToken',
          expiresIn: 3600,
        },
      };

      // Mock the AuthService's login method to return mockResponse
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await authController.login(loginDto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error when login fails', async () => {
      const loginDto: LoginDto = {
        username: 'testUser',
        password: 'testPassword',
        user: {
          id: '1',
          username: 'testuser',
          password: 'hashedPassword',
          role: UserRole.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      };

      // Simulate an error from the service
      mockAuthService.login.mockRejectedValue(
        new BadRequestException('Invalid Credentials'),
      );

      try {
        await authController.login(loginDto);
      } catch (error) {
        expect(error.response.message).toBe('Invalid Credentials');
      }
    });
  });
});
