import { Test, TestingModule } from '@nestjs/testing';
import UsersService from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import {
  user1,
  roleClient,
  createUser,
  updteUserDto,
} from './mocks/users.mocks';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repoUser: Repository<User>;
  let repoRole: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        { provide: getRepositoryToken(Role), useClass: Repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repoUser = module.get<Repository<User>>(getRepositoryToken(User));
    repoRole = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUsers', () => {
    it('should be defined', () => {
      expect(service.getUsers).toBeDefined();
    });
    it('call repoUser.find()', () => {
      const result = [user1];
      const getUsersspy = jest
        .spyOn(repoUser, 'find')
        .mockImplementation(() => {
          return Promise.resolve(result);
        });
      service.getUsers();
      expect(getUsersspy).toBeCalledTimes(1);
    });
  });
  describe('createUser', () => {
    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });
    it('calls in createUser', async () => {
      const user = user1;
      const role = roleClient;
      const createDto = createUser;
      const spyfindemail = jest
        .spyOn(service, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      const spyfindOne = jest
        .spyOn(repoRole, 'findOne')
        .mockImplementation(() => {
          return Promise.resolve(role);
        });
      const spycreate = jest
        .spyOn(repoUser, 'create')
        .mockImplementation(() => {
          return user;
        });
      const spyFindemail = jest
        .spyOn(repoUser, 'save')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      await service.createUser(createDto);
      expect(spyfindemail).toHaveBeenCalled();
      expect(spyfindOne).toHaveBeenCalled();
      expect(spycreate).toHaveBeenCalled();
      expect(spyFindemail).toHaveBeenCalled();
    });

    it('should thow Conflit', async () => {
      const user = user1;
      const createDto = createUser;
      const spyfindemail = jest
        .spyOn(service, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      try {
        const res = await service.createUser(createDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(spyfindemail).toHaveBeenCalled();
      }
    });
  });

  describe('updateUser', () => {
    it('should be defined', () => {
      expect(service.updateUser).toBeDefined();
    });
    it('calls in updateUser', async () => {
      const user = user1;
      const updtUser = updteUserDto;
      const spygetUserByIdOrThrow = jest
        .spyOn(service, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spycreate = jest
        .spyOn(repoUser, 'create')
        .mockImplementation(() => {
          return user;
        });
      const spyFindemail = jest
        .spyOn(repoUser, 'save')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      await service.updateUser(user.id, updtUser);
      expect(spygetUserByIdOrThrow).toHaveBeenCalled();
      expect(spycreate).toHaveBeenCalled();
      expect(spyFindemail).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should be defined', () => {
      expect(service.deleteUser).toBeDefined();
    });
    it('calls in createUser', async () => {
      const user = user1;
      const spygetUserByIdOrThrow = jest
        .spyOn(service, 'getUserByIdOrThrow')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      const spycreate = jest
        .spyOn(repoUser, 'create')
        .mockImplementation(() => {
          return user;
        });
      const spyFindemail = jest
        .spyOn(repoUser, 'save')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      expect(await service.deleteUser(user.id)).toBe(null);
      expect(spygetUserByIdOrThrow).toHaveBeenCalled();
      expect(spycreate).toHaveBeenCalled();
      expect(spyFindemail).toHaveBeenCalled();
    });
  });
});
