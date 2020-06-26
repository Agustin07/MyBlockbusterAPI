import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Rental } from './rental.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  poster: string;

  @Column()
  stock: number;

  @Column()
  trailer: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column({ default: 0 })
  likes: number;

  @Column()
  availability: boolean;

  @Column({ default: true, select: false })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'now()', select: false })
  createdAt: Date;

  @Column('timestamp', { nullable: true, default: null, select: false })
  modifiedAt: Date;

  @Column('timestamp', { nullable: true, default: null, select: false })
  deletedAt: Date;

  @ManyToMany((type) => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany((type) => Rental, (rental) => rental.user)
  rentals: Rental[];
}
