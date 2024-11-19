import { Book } from '@app/modules/books/entities/book.entity';
import { User } from '@app/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'reading_intervals' })
export class ReadingInterval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.readingIntervals)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Book, (book) => book.readingIntervals)
  @JoinColumn({ name: 'book_id' })
  book: Relation<Book>;

  @Column({ name: 'start_page' })
  startPage: number;

  @Column({ name: 'end_page' })
  endPage: number;
}
