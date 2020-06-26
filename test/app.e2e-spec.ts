import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import UsersService from '../src/users/users.service';
import { user1 } from '../src/users/mocks/users.mocks';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService = { findOneByEmail: () =>  user1 };


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(UsersService).useValue(userService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  

  afterAll(async () => {
    await app.close();
  });
});
