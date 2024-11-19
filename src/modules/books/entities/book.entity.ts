import { ReadingInterval } from '@app/modules/reading-interval/entities/reading-interval.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'books' })
@Index(['name'], { unique: true })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Reference Columns
  @OneToMany(() => ReadingInterval, (readingInterval) => readingInterval.book)
  readingIntervals: ReadingInterval[];

  // Normal Columns
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'number_of_pages' })
  numberOfPages: number;

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
