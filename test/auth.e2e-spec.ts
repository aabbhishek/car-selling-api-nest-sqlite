import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const testUser = {
      email: faker.internet.email(
        faker.name.firstName(),
        faker.name.lastName(),
      ),
      password: faker.internet.password(),
    };

    return request(app.getHttpServer())
      .post('/auth/signUp')
      .send(testUser)
      .expect(StatusCodes.CREATED)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(testUser.email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const testUser = {
      email: faker.internet.email(
        faker.name.firstName(),
        faker.name.lastName(),
      ),
      password: faker.internet.password(),
    };

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser)
      .expect(HttpStatus.CREATED);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    expect(body.email).toEqual(testUser.email);
  });
});
