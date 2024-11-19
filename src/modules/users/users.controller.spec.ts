import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@app/modules/users/users.controller';
import { UsersService } from '@app/modules/users/users.service';
import { JwtGuard } from '@app/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@app/modules/auth/guard/role.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from '@app/modules/users/entities/user.entity';
import { UserRole } from '@app/modules/users/enums/role.enum';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .overrideGuard(ThrottlerGuard)
      .useValue({})
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return a user by ID', async () => {
      const user: User = {
        id: '1',
        username: 'testUsername',
        role: UserRole.USER,
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        readingIntervals: [],
      };
      mockUsersService.find.mockResolvedValue(user);
      jest.spyOn(usersService, 'find').mockResolvedValue({ data: user });

      const result = await controller.find('1');
      expect(result.data).toEqual(user);
      expect(mockUsersService.find).toHaveBeenCalledWith('1');
    });

    it('should throw an error if the user is not found', async () => {
      jest
        .spyOn(usersService, 'find')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.find('1')).rejects.toThrow();
      expect(usersService.find).toHaveBeenCalledWith('1');
    });
  });
});
