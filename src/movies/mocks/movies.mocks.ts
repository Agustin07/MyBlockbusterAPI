import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, CreateTagDto } from '../dto/movie.dto';
import { Tag } from '../entities/tag.entity';

export const createMovieDto: CreateMovieDto = {
  title: '21 Jump Street',
  description: 'The best police officers of their home',
  poster: 'https://i.ibb.co/Nst027S/descarga.jpg',
  stock: 2,
  trailer: 'https://www.youtube.com/watch?v=RLoKtb4c4W0',
  price: 5.99,
  availability: false,
};

export const movie1: Movie = {
  id: 1,
  title: 'Finding Nemo',
  description: 'Marlyn is a fish and is looking for Nemo',
  poster: 'https://i.ibb.co/k8Dkx86/descarga-2.jpg',
  stock: 5,
  trailer: 'https://www.youtube.com/watch?v=9oQ628Seb9w',
  price: 5.99,
  availability: true,
  likes: 0,
  isActive: true,
  createdAt: new Date('2020-06-25'),
  modifiedAt: new Date('2020-06-25'),
  deletedAt: new Date('2020-06-25'),
  tags: [],
  rentals: [],
};

export const tag1: Tag = { id: 1, name: 'COMEDY' };
export const tag2: Tag = { id: 2, name: 'ACTION' };

export const tagDto1: CreateTagDto = { name: 'COMEDY' };

export const movie2: Movie = {
  id: 2,
  title: 'Finding Dory',
  description: 'Now Marlyn and Nemo are looking for Dory',
  poster: 'https://i.ibb.co/Kyp82Br/descarga-3.jpg',
  stock: 1,
  trailer: 'https://www.youtube.com/watch?v=JhvrQeY3doI',
  price: 6.99,
  availability: true,
  likes: 0,
  isActive: true,
  createdAt: new Date('2020-06-25'),
  modifiedAt: new Date('2020-06-25'),
  deletedAt: new Date('2020-06-25'),
  tags: [],
  rentals: [],
};

export const movie3: Movie = {
  id: 3,
  title: '21 Jump Street',
  description: 'The best police officers of their home',
  poster: 'https://i.ibb.co/Nst027S/descarga.jpg',
  stock: 2,
  trailer: 'https://www.youtube.com/watch?v=RLoKtb4c4W0',
  price: 5.99,
  availability: false,
  likes: 0,
  isActive: true,
  createdAt: new Date('2020-06-25'),
  modifiedAt: new Date('2020-06-25'),
  deletedAt: new Date('2020-06-25'),
  tags: [tag1],
  rentals: [],
};
