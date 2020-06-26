import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import UsersService from '../users/users.service';
import { user1, userDTo1 } from '../users/mocks/users.mocks';
import { UnauthorizedException } from '@nestjs/common';

const mock_UsersService = {
  findOneByEmail: jest.fn(),
};
const mock_jwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mock_UsersService },
        { provide: JwtService, useValue: mock_jwtService },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should be defined', () => {
      expect(service.validateUser).toBeDefined();
    });
    it('should validate user', async () => {
      const user = user1;
      const spyfindOneByEmail = jest
        .spyOn(usersService, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(user);
        });
      expect(await service.validateUser(user.email, 'pineapple')).toBe(user);
      expect(spyfindOneByEmail).toHaveBeenCalledTimes(1);
    });
    it('should throw on invalid email', async () => {
      const user = user1;
      const spyfindOneByEmail = jest
        .spyOn(usersService, 'findOneByEmail')
        .mockImplementation(() => {
          return Promise.resolve(undefined);
        });
      try {
        await service.validateUser('jsoidfjsdm', 'pineapple');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(service.login).toBeDefined();
    });
    it('should return {access_token: jwtToken}', async () => {
      const ImAToken = '$hklknhmlhKUG6D8.onhIGUKhnGKMhg';
      const userDto = userDTo1;
      const spysign = jest.spyOn(jwtService,'sign').mockImplementation(()=>ImAToken);
      const expected = {access_token: '$hklknhmlhKUG6D8.onhIGUKhnGKMhg'};
      expect(await service.login(userDto)).toEqual(expected);
      expect(spysign).toHaveBeenCalled();
    });
  });

});
