import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@app/modules/users/entities/user.entity';
import { CreateUserDto } from '@app/modules/users/dto/create-user.dto';
import { generateHashPassword } from '@app/common/utils/hash-password.utils';
import { ConfigService } from '@nestjs/config';
import { IResponse } from '@app/common/utils/iresponse';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new user
   * @param createUserDto CreateUserDto - User data
   * @returns Promise<User> - Created user
   */
  async create({ password, ...createUserDto }: CreateUserDto) {
    const salt = this.configService.get('auth.salt');

    const hashedPassword = generateHashPassword(password, salt);

    const userEntity = this.userRepository.create({ ...createUserDto });
    Object.assign(userEntity, { password: hashedPassword });

    return this.userRepository.save(userEntity);
  }

  /**
   * Find a user by id
   * @param id string - User id
   * @returns Promise<User> - User found
   */
  async findOneById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Find a user by username
   * @param username string - User username
   * @returns Promise<User> - User found
   */
  async findOneByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * Find a user by email
   * @param email string - User email
   * @returns Promise<User> - User found
   */
  async find(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
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
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return <IResponse<User>>{
      data: user,
    };
  }
}
