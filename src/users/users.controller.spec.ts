import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserDto, CreateUserDto } from './dto/user.dto';
import { Role } from './entities/role.entity';
import UsersService from './users.service';
import { userDto2, user1, authUser, updteUserDto } from './mocks/users.mocks';
import { User } from './entities/user.entity';
import { UsersServiceFake } from './mocks/users.service.mocks';
import { BadRequestException } from '@nestjs/common';

const mock_UsersService = {
  createUser: jest.fn(
    async (data: CreateUserDto): Promise<UserDto> => {
      return Promise.resolve({
        id: 1,
        username: data.username,
        email: data.email,
        role: { id: 2, name: 'CLIENT' } as Role,
      });
    },
  ),

  findOneByEmail: jest.fn().mockImplementation((email) => {
    Promise.resolve({
      id: 1,
      username: 'agusxx',
      password: 'pineapple',
      email,
    });
  }),
};

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: UsersServiceFake,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should return UserDto ', async () => {
      const createUserSpy = jest.spyOn(service, 'createUser');
      const mock_userdto: CreateUserDto = {
        email: 'rigoomartinez@gmail.com',
        username: 'agusxx',
        password: 'pineapple',
      };
      await controller.createUser(mock_userdto);
      expect(createUserSpy).toBeCalledWith(mock_userdto);
      expect(createUserSpy).toBeCalledTimes(1);
    });
  });

  describe('getUsers', () => {
    it('should return User array ', async () => {
      const result = [user1];
      const createUserSpy = jest
        .spyOn(service, 'getUsers')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.getUsers()).toEqual(result);
      expect(createUserSpy).toBeCalledTimes(1);
    });
  });

  describe('getUser', () => {
    it('should return one User ', async () => {
      const result = user1;
      const createUserSpy = jest
        .spyOn(service, 'getUserWithRentalOrThrow')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.getUser(user1.id)).toEqual(result);
      expect(createUserSpy).toBeCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    it('should return updated user ', async () => {
      const authuserDto = authUser;
      const updateInfo = updteUserDto;
      const result = { ...user1, ...updateInfo };
      const createUserSpy = jest
        .spyOn(service, 'updateUser')
        .mockImplementation(() => Promise.resolve(result as User));
      expect(
        await controller.updateUser(user1.id, updateInfo, authuserDto),
      ).toEqual(result);
    });
    it('should throw a BadRequestException', async () => {
      const authuserDto = authUser;
      const updateInfo = updteUserDto;
      try {
        await controller.updateUser(3, updateInfo, authuserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('updateUser', () => {
    it('should return updated user ', async () => {
      const authuserDto = authUser;
      const updateInfo = updteUserDto;
      const deleteUserSpy = jest
        .spyOn(service, 'deleteUser')
        .mockImplementation(() => Promise.resolve(null));
      expect(await controller.deleteUser(user1.id, authuserDto)).toEqual(null);
      expect(deleteUserSpy).toHaveBeenCalledTimes(1);
      expect(deleteUserSpy).toHaveBeenCalledWith(user1.id);
    });
    it('should throw a BadRequestException', async () => {
      const authuserDto = authUser;
      try {
        await controller.deleteUser(3, authuserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
