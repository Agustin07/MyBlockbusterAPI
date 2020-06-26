import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto, UpdateMovieDto, CreateTagDto } from './dto/movie.dto';
import { Tag } from './entities/tag.entity';
import { Rental } from './entities/rental.entity';
import { User } from 'src/users/entities/user.entity';

export class RentalService {
  public constructor(
    @InjectRepository(Movie)
    private readonly repoMovies: Repository<Movie>,
    @InjectRepository(Tag)
    private readonly repoTags: Repository<Tag>,
    @InjectRepository(Rental)
    private readonly repoRentals: Repository<Rental>,
  ) {}

  async findRentalOrThrow(movieId: number, userId: number) {
    const rental = await this.findRental(movieId, userId);
    if (!rental) {
      throw new NotFoundException('No rent found for this movie.');
    }
    return rental;
  }

  async findRental(movieId: number, userId: number) {
    const rental = await this.repoRentals
      .createQueryBuilder('rental')
      .where('rental.status = :status', { status: 1 })
      .innerJoinAndSelect('rental.movie', 'movie', 'movie.id = :movieId', {
        movieId: movieId,
      })
      .innerJoinAndSelect('rental.user', 'user', 'user.id = :userId', {
        userId: userId,
      })
      .getOne();
    return rental;
  }

  saveRentOrSoldMovie(movie: Movie, user: User, sell: boolean) {
    const status = !sell ? 1 : 2;
    const rental = this.repoRentals.create({
      movie: movie,
      user: user,
      status: status,
    });
    const newRental = this.repoRentals.save(rental);
    return newRental;
  }

  rentOrSellMovie(movie: Movie) {
    if (movie.stock === 0) throw new NotFoundException('Sorry, sold out.');
    if (movie.availability === false)
      throw new NotFoundException('Sorry, not available.');
    movie.stock--;
    if (movie.stock === 0) movie.availability = false;
    return movie;
  }

  returnMovie(movie: Movie) {
    movie.stock++;
    if (movie.availability === false) movie.availability = true;
    return movie;
  }

  async removeRental(rental: Rental) {
    await this.repoRentals.remove(rental);
  }

  async sellMovie(rental: Rental) {
    const sale = await this.repoRentals.create({ ...rental, status: 2 });
    const savedSale = await this.repoRentals.save(sale);
    return `Hi! ${savedSale.user.username}, enjoy ${savedSale.movie.title} :D`;
  }
}
