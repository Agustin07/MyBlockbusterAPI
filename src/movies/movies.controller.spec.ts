import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesServiceFake } from './mocks/movies.service.mocks';
import {
  movie1,
  movie2,
  createMovieDto,
  movie3,
  tagDto1,
} from './mocks/movies.mocks';

describe('Movies Controller', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: MoviesServiceFake }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return an array of movies ', async () => {
      const result = [movie1, movie2];
      const spygetMovies = jest
        .spyOn(moviesService, 'getMovies')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.getMovies()).toEqual(result);
      expect(spygetMovies).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMovie', () => {
    it('should return one movie ', async () => {
      const result = movie1;
      const spyfindOneByIdOrThrow = jest
        .spyOn(moviesService, 'findOneByIdOrThrow')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.getMovie(movie1.id)).toEqual(result);
      expect(spyfindOneByIdOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('createMovie', () => {
    it('should return a new movie', async () => {
      const newMovieDto = createMovieDto;
      const spycreateOne = jest
        .spyOn(moviesService, 'createOne')
        .mockImplementation(() => Promise.resolve(movie3));
      expect(await controller.createMovie(newMovieDto)).toEqual(movie3);
      expect(spycreateOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateMovie', () => {
    it('should return a updated movie', async () => {
      const updateMovieDto = createMovieDto;
      const spyupdateOne = jest
        .spyOn(moviesService, 'updateOne')
        .mockImplementation(() => Promise.resolve(movie3));
      expect(await controller.updateMovie(movie3.id, updateMovieDto)).toEqual(
        movie3,
      );
      expect(spyupdateOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteMovie', () => {
    it('should delete movie, no return', async () => {
      const spyremoveOne = jest
        .spyOn(moviesService, 'removeOne')
        .mockImplementation(() => Promise.resolve(null));
      expect(await controller.deleteMovie(3)).toEqual(null);
      expect(spyremoveOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTag', () => {
    it('should return a movie with tag added', async () => {
      const movie = movie3;
      const createTag = tagDto1;
      const spyaddTag = jest
        .spyOn(moviesService, 'addTag')
        .mockImplementation(() => Promise.resolve(movie));
      const rest = await controller.addTag(movie.id, createTag);
      expect(rest.tags[0].name).toEqual(movie.tags[0].name);
      expect(spyaddTag).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTag', () => {
    it('should return a movie the tag deleted', async () => {
      const movie = movie3;
      const createTag = tagDto1;
      const spydeleteTag = jest
        .spyOn(moviesService, 'deleteTag')
        .mockImplementation(() => Promise.resolve(movie));
      const rest = await controller.deleteTag(movie.id, createTag);
      expect(rest).toEqual(movie);
      expect(spydeleteTag).toHaveBeenCalledTimes(1);
    });
  });

  /**
 * addTag(@Param('id', ParseIntPipe) id: number, @Body() tag: CreateTagDto) { 
        const movie = this.moviesService.addTag(id, tag);
        return movie;
    }
 */
});
