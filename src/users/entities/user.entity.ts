import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';
import { Rental } from '../../movies/entities/rental.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true, select: false })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'now()', select: false })
  createdAt: Date;

  @Column('timestamp', { nullable: true, default: null, select: false })
  modifiedAt: Date;

  @Column('timestamp', { nullable: true, default: null, select: false })
  deletedAt: Date;

  @ManyToOne((type) => Role, (role) => role.users)
  role: Role;

  @OneToMany((type) => Rental, (rental) => rental.user)
  rentals: Rental[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
