import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/user.dto';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';

export const UsersServiceFake = {
  createUser: jest.fn(
    async (data: CreateUserDto): Promise<Partial<User>> => {
      return Promise.resolve({
        id: 2,
        username: data.username,
        email: data.email,
        role: { id: 2, name: 'CLIENT' } as Role,
      });
    },
  ),
  getUsers: jest.fn(),
  getUserByIdOrThrow: jest.fn(),
  getUserWithRentalOrThrow: jest.fn(),
  findOneByEmail: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

/*
    getUsers() {}
  
  
    async getUserByIdOrThrow( id: number) {}
  
    async getUserWithRentalOrThrow( id: number) {}
  
    async findOneByEmail(email: string) {}
  
    async createUser(data: CreateUserDto) {}
  
    async updateUser(id: number , data: UpdateUserDto) {}
  
  
    async deleteUser(id: number) {}
  }
  */
