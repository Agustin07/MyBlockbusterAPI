import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Movie } from './movie.entity';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'now()', select: false })
  createdAt: Date;

  @Column()
  status: number;

  @ManyToOne((type) => User, (user) => user.rentals)
  user: User;

  @ManyToOne((type) => Movie, (movies) => movies.rentals)
  movie: Movie;
}
