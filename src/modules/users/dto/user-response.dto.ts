import { Exclude } from 'class-transformer';

export class UserResponse {
  id: string;
  username: string;
  role: string;

  @Exclude()
  password?: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date | null;
}
