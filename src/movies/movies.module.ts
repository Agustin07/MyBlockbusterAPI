import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { Rental } from './entities/rental.entity';
import { Tag } from './entities/tag.entity';
import { Movie } from './entities/movie.entity';
import { RentalService } from './rental.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Rental, Movie, Tag]),
    UsersModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, RentalService],
})
export class MoviesModule {}
