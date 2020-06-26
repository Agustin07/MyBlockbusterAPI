import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import {
  movie1,
  movie2,
  movie3,
  createMovieDto,
  tag1,
  tagDto1,
} from './mocks/movies.mocks';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RentalServiceFake } from './mocks/rental.service.mocks';
import { RentalService } from './rental.service';
import UsersService from '../users/users.service';
import { UsersServiceFake } from '../users/mocks/users.service.mocks';
import { user1 } from '../users/mocks/users.mocks';
import { Rental } from './entities/rental.entity';

describe('MoviesService', () => {
  let service: MoviesService;
  let repoMovies: Repository<Movie>;
  let repoTags: Repository<Tag>;
  let rentalService: RentalService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: RentalService, useValue: RentalServiceFake },
        { provide: UsersService, useValue: UsersServiceFake },
        { provide: getRepositoryToken(Movie), useClass: Repository },
        { provide: getRepositoryToken(Tag), useClass: Repository },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    rentalService = module.get<RentalService>(RentalService);
    usersService = module.get<UsersService>(UsersService);
    repoMovies = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    repoTags = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByIdOrThrow', () => {
    it('should return a movie by id', async () => {
      const movie = movie3;
      const spyfindOne = jest
        .spyOn(repoMovies, 'findOne')
        .mockImplementation(() => Promise.resolve(movie));
      const rest = await service.findOneByIdOrThrow(movie.id);
      expect(rest).toEqual(movie3);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
    });
    it('should thow NotFoundException', async () => {
      const movie = movie3;
      const spyfindOne = jest
        .spyOn(repoMovies, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));
      try {
        await service.findOneByIdOrThrow(5);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('createOne', () => {
    it('should be defined', () => {
      expect(service.createOne).toBeDefined();
    });
    it('calls in createOne', async () => {
      const moviedto = createMovieDto;
      const spycreate = jest
        .spyOn(repoMovies, 'create')
        .mockImplementation(() => {
          return movie3;
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie3);
      });
      const res = await service.createOne(moviedto);
      expect(res).toBe(movie3);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeOne', () => {
    it('should be defined', () => {
      expect(service.removeOne).toBeDefined();
    });
    it('calls in removeOne', async () => {
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie3);
        });
      const spycreate = jest
        .spyOn(repoMovies, 'create')
        .mockImplementation(() => {
          return movie3;
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie3);
      });
      const res = await service.removeOne(3);
      expect(res).toBe(null);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOne', () => {
    it('should be defined', () => {
      expect(service.updateOne).toBeDefined();
    });
    it('calls in updateOne', async () => {
      const updateMovie = createMovieDto;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie3);
        });
      const spycreate = jest
        .spyOn(repoMovies, 'create')
        .mockImplementation(() => {
          return movie3;
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie3);
      });
      const res = await service.updateOne(3, updateMovie);
      expect(res).toBe(movie3);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('findTagOrThrow', () => {
    it('should be defined', () => {
      expect(service.findTagOrThrow).toBeDefined();
    });
    it('calls in findTagOrThrow', async () => {
      const name = 'COMEDY';
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(tag1);
        });
      const res = await service.findTagOrThrow(name);
      expect(res).toBe(tag1);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      const name = 'COMEDY';
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      try {
        await service.findTagOrThrow(name);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('addTag', () => {
    it('should be defined', () => {
      expect(service.addTag).toBeDefined();
    });
    it('calls in addTag when tag exists', async () => {
      const tagData = tagDto1;
      const movie = movie3;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie);
        });
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(tag1);
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie);
      });
      const res = await service.addTag(movie.id, tagData);
      expect(res).toBe(movie);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
    });

    it('calls in addTag when the tag is new', async () => {
      const tagData = tagDto1;
      const movie = movie3;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie);
        });
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });

      const spycreate = jest
        .spyOn(repoTags, 'create')
        .mockImplementation(() => {
          return tag1;
        });
      const spysaveT = jest.spyOn(repoTags, 'save').mockImplementation(() => {
        return Promise.resolve(tag1);
      });

      const spysaveM = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie);
      });
      const res = await service.addTag(movie.id, tagData);
      expect(res).toBe(movie);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
      expect(spycreate).toHaveBeenCalledTimes(1);
      expect(spysaveT).toHaveBeenCalledTimes(1);
      expect(spysaveM).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTag', () => {
    it('should be defined', () => {
      expect(service.deleteTag).toBeDefined();
    });
    it('calls in deleteTag when tag exists', async () => {
      const tagData = tagDto1;
      const movie = movie3;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie);
        });
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(tag1);
        });
      const spysave = jest.spyOn(repoMovies, 'save').mockImplementation(() => {
        return Promise.resolve(movie);
      });
      const res = await service.deleteTag(movie.id, tagData);
      expect(res).toBe(movie);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(spyfindOne).toHaveBeenCalledTimes(1);
      expect(spysave).toHaveBeenCalledTimes(1);
    });

    it('throw NotFoundException when the tag does not exist', async () => {
      const tagData = tagDto1;
      const movie = movie3;
      const spyfindOneByIdOrThrow = jest
        .spyOn(service, 'findOneByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(movie);
        });
      const spyfindOne = jest
        .spyOn(repoTags, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      try {
        await service.deleteTag(movie.id, tagData);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('buyOneMovie', () => {
    it('should be defined', () => {
      expect(service.buyOneMovie).toBeDefined();
    });
    it('calls in buyOneMovie when rental exists', async () => {
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
        .spyOn(rentalService, 'findRental')
        .mockImplementation(() => {
          return Promise.resolve(rental);
        });
      const spysellMovie = jest
        .spyOn(rentalService, 'sellMovie')
        .mockImplementation(() => {
          return Promise.resolve(
            `Hi! ${user.username}, enjoy ${movie.title} :D`,
          );
        });

      const res = await service.buyOneMovie(movie.id, user.id);
      expect(res).toBe(`Hi! ${user.username}, enjoy ${movie.title} :D`);
      expect(spyfindRental).toHaveBeenCalledTimes(1);
      expect(spysellMovie).toHaveBeenCalledTimes(1);
    });

    it('calls in buyOneMovie when rental does not exists', async () => {
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
        .spyOn(rentalService, 'findRental')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });

      const spynewRentOrSellMovie = jest
        .spyOn(service, 'newRentOrSellMovie')
        .mockImplementation(() => {
          return Promise.resolve(rental);
        });

      const res = await service.buyOneMovie(movie.id, user.id);
      expect(res).toBe(`Hi! ${user.username}, enjoy ${movie.title} :D`);
      expect(spynewRentOrSellMovie).toHaveBeenCalledTimes(1);
    });
  });
});
