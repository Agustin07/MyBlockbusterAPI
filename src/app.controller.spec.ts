import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userDTo1, authUser, user1 } from './users/mocks/users.mocks';
import { AuthService } from './auth/auth.service';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn((user) => {
              return { access_token: 'givin a token 🛂' };
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('shoud return "I am a 🍍 "', () => {
      expect(appController.pineapple(authUser)).toBe('I am a 🍍 ');
    });
  });

  describe('login', () => {
    it('should return a jwt-key', async () => {
      const spy = jest.spyOn(authService, 'login').mockImplementation();
      await appController.login(userDTo1);
      expect(spy).toHaveBeenCalledWith(userDTo1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
