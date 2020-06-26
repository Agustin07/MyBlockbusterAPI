import { Test, TestingModule } from '@nestjs/testing';
import { RentalService } from './rental.service';
import { movie1, movie2, movie3 } from './mocks/movies.mocks';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Rental } from './entities/rental.entity';
import { user1 } from '../users/mocks/users.mocks';

describe('RentalService', () => {
  let service: RentalService;
  let repoMovies: Repository<Movie>;
  let repoTags: Repository<Tag>;
  let repoRentals: Repository<Rental>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalService,
        { provide: getRepositoryToken(Movie), useClass: Repository },
        { provide: getRepositoryToken(Tag), useClass: Repository },
        { provide: getRepositoryToken(Rental), useClass: Repository },
      ],
    }).compile();

    service = module.get<RentalService>(RentalService);
    repoMovies = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    repoTags = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    repoRentals = module.get<Repository<Rental>>(getRepositoryToken(Rental));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('rentOrSellMovie', () => {
    it('should return a movie with stock: 4', () => {
      let res = service.rentOrSellMovie(movie1);
      expect(res.stock).toEqual(4);
      expect(res.availability).toEqual(true);
    });
    it('should return a movie with stock: 0, availability: false ', () => {
      let res = service.rentOrSellMovie(movie2);
      expect(res.stock).toEqual(0);
      expect(res.availability).toEqual(false);
    });
    it('should throw on stock 0 ', () => {
      try {
        service.rentOrSellMovie(movie2);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    it('should throw on not available movie ', () => {
      try {
        service.rentOrSellMovie(movie3);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('returnMovie', () => {
    it('should return a movie with stock: 5', () => {
      let res = service.returnMovie(movie1);
      expect(res.stock).toEqual(5);
      expect(res.availability).toEqual(true);
    });
    it('should return a movie with stock: 0, availability: true ', () => {
      let res = service.returnMovie(movie2);
      expect(res.stock).toEqual(1);
      expect(res.availability).toEqual(true);
    });
  });

  describe('findRentalOrThrow', () => {
    it('should be defined', () => {
      expect(service.findRentalOrThrow).toBeDefined();
    });
    it('calls in findRentalOrThrow', async () => {
      const user = user1;
      const movie = movie3;
      const rental: Rental = {
        id: 1,
        movie: movie3,
        user: user1,
        status: 1,
        createdAt: new Date('2020-06.25'),
      };

      const spyfindRental = jest
        .spyOn(service, 'findRental')
        .mockImplementation(() => {
          return Promise.resolve(rental);
        });
      const res = await service.findRentalOrThrow(movie.id, user.id);

      expect(res).toBe(rental);
      expect(spyfindRental).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      const user = user1;
      const movie = movie3;
      const spyfindRental = jest
        .spyOn(service, 'findRental')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      try {
        await service.findRentalOrThrow(movie.id, user.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('saveRentOrSoldMovie', () => {
    it('should be defined', () => {
      expect(service.saveRentOrSoldMovie).toBeDefined();
    });
    it('should save a Rent, and return the data', async () => {
      const user = user1;
      const movie = movie3;
      const rental: Rental = {
        id: 1,
        movie: movie3,
        user: user1,
        status: 1,
        createdAt: new Date('2020-06.25'),
      };
      const spycreate = jest
        .spyOn(repoRentals, 'create')
        .mockImplementation(() => {
          return rental;
        });
      const spysave = jest.spyOn(repoRentals, 'save').mockImplementation(() => {
        return Promise.resolve(rental);
      });
      const res = await service.saveRentOrSoldMovie(movie, user, false);
      expect(res).toBe(rental);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
    });

    it('should save a Sell, and return the data', async () => {
      const user = user1;
      const movie = movie3;
      const rental: Rental = {
        id: 1,
        movie: movie3,
        user: user1,
        status: 1,
        createdAt: new Date('2020-06.25'),
      };
      const spycreate = jest
        .spyOn(repoRentals, 'create')
        .mockImplementation(() => {
          return rental;
        });
      const spysave = jest.spyOn(repoRentals, 'save').mockImplementation(() => {
        return Promise.resolve(rental);
      });
      const res = await service.saveRentOrSoldMovie(movie, user, true);
      expect(res).toBe(rental);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
    });
  });
});
