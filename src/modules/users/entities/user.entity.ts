import { UserRole } from '@app/modules/users/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Reference Columns
  @OneToMany(() => ReadingInterval, (readingInterval) => readingInterval.user)
  readingIntervals: ReadingInterval[];

  // Normal Columns
  @Column({ unique: true })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ enum: UserRole, type: 'enum' })
  role: UserRole;

  // Timestamp Columns
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date;
}
