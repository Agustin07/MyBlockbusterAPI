import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto, UpdateMovieDto, CreateTagDto } from './dto/movie.dto';
import { Tag } from './entities/tag.entity';
import { RentalService } from './rental.service';
import UsersService from '../users/users.service';
import { Rental } from './entities/rental.entity';

@Injectable()
export class MoviesService {
  public constructor(
    @InjectRepository(Movie)
    private readonly repoMovies: Repository<Movie>,
    @InjectRepository(Tag)
    private readonly repoTags: Repository<Tag>,
    private rentalService: RentalService,
    private usersService: UsersService,
  ) {}

  async getMovies() {
    const movies = await this.repoMovies
      .createQueryBuilder('movie')
      .where('movie.isActive = :isActive', { isActive: true })
      .where('movie.availability = :availability', { availability: true })
      .leftJoinAndSelect('movie.tags', 'tag')
      .orderBy('movie.title', 'ASC')
      .getMany();
    return movies;
  }

  async findOneByIdOrThrow(id: number) {
    const movie = await this.repoMovies.findOne(id, {
      where: { isActive: true },
      relations: ['tags'],
    });
    if (!movie) {
      throw new NotFoundException('No movie found.');
    }
    return movie;
  }

  async createOne(data: CreateMovieDto) {
    const movie = this.repoMovies.create({ ...data });
    const createdMovie = await this.repoMovies.save(movie);
    return createdMovie;
  }

  public async removeOne(id: number) {
    const existingMovie = await this.findOneByIdOrThrow(id);
    const movie = this.repoMovies.create({
      ...existingMovie,
      isActive: false,
    });
    await this.repoMovies.save(movie);
    return null;
  }

  public async updateOne(id: number, data: UpdateMovieDto) {
    const { ...updateData } = data;
    const existingMovie = await this.findOneByIdOrThrow(id);
    const movie = this.repoMovies.create({
      ...existingMovie,
      ...updateData,
    });
    const updatedMovie = await this.repoMovies.save(movie);
    return updatedMovie;
  }

  async findTagOrThrow(name: string) {
    const tag = await this.repoTags.findOne({ where: { name: name } });
    if (!tag) {
      throw new NotFoundException('No tag found.');
    }
    return tag;
  }

  async addTag(id: number, data: CreateTagDto) {
    const existingMovie = await this.findOneByIdOrThrow(id);
    let tag = await this.repoTags.findOne({ where: { name: data.name } });
    if (!tag) {
      const newtag = this.repoTags.create({ ...data });
      tag = await this.repoTags.save(newtag);
    }
    existingMovie.tags = [...existingMovie.tags, tag];

    const movie = await this.repoMovies.save(existingMovie);
    return movie;
  }

  async deleteTag(id: number, data: CreateTagDto) {
    const movie = await this.findOneByIdOrThrow(id);
    const tagToRemove = await this.repoTags.findOne({
      where: { name: data.name },
    });
    if (!tagToRemove) {
      throw new NotFoundException('No tag found.');
    }

    movie.tags = movie.tags.filter((tag) => {
      return tag.id !== tagToRemove.id;
    });
    const updatedMovie = await this.repoMovies.save(movie);
    return updatedMovie;
  }

  async newRentOrSellMovie(
    movieId: number,
    userId: number,
    sell: boolean,
  ): Promise<Rental> {
    const movie = await this.findOneByIdOrThrow(movieId);
    const user = await this.usersService.getUserByIdOrThrow(userId);

    const soldMovie = this.rentalService.rentOrSellMovie(movie);

    const newRental = await this.rentalService.saveRentOrSoldMovie(
      soldMovie,
      user,
      sell,
    );
    await this.repoMovies.save(soldMovie);

    return newRental;
  }

  async rentOneMovie(movieId: number, userId: number) {
    await this.newRentOrSellMovie(movieId, userId, false);
    return await this.usersService.getUserWithRentalOrThrow(userId);
  }

  async returnOneMovie(movieId: number, userId: number) {
    const rental = await this.rentalService.findRentalOrThrow(movieId, userId);
    const returnedMovie = this.rentalService.returnMovie(rental.movie);
    const movie = await this.repoMovies.save(returnedMovie);
    await this.rentalService.removeRental(rental);
    return `Movie: ${movie.title} returned!`;
  }

  async buyOneMovie(movieId: number, userId: number) {
    const rental = await this.rentalService.findRental(movieId, userId);
    if (rental) return this.rentalService.sellMovie(rental);

    const savedSale = await this.newRentOrSellMovie(movieId, userId, true);

    return `Hi! ${savedSale.user.username}, enjoy ${savedSale.movie.title} :D`;
  }
}
