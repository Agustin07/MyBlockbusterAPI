import { Movie } from '../entities/movie.entity';
import { movie1 } from './movies.mocks';

export const MoviesServiceFake = {
  getMovies: jest.fn(
    async (): Promise<Movie[]> => {
      return Promise.resolve([movie1]);
    },
  ),
  findOneByIdOrThrow: jest.fn(),
  createOne: jest.fn(),
  removeOne: jest.fn(),
  updateOne: jest.fn(),
  findTagOrThrow: jest.fn(),
  addTag: jest.fn(),
  deleteTag: jest.fn(),
  newRentOrSellMovie: jest.fn(),
  rentOneMovie: jest.fn(),
  returnOneMovie: jest.fn(),
  buyOneMovie: jest.fn(),
};
/*    

createUser: jest.fn(async (data: CreateUserDto): Promise<Partial<User>> => {
        return Promise.resolve({ id:2, username:data.username,  email:data.email, role: {id:2, name:'CLIENT'} as Role });
      }),



    */
