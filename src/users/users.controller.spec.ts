import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { faker } from '@faker-js/faker';
import { User } from './users.entities';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakerAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: string) => {
        return Promise.resolve({
          id,
          email: faker.internet.email(
            faker.name.firstName(),
            faker.name.lastName(),
          ),
          password: faker.internet.password(),
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: uuidv4(),
            email,
            password: faker.internet.password(),
          } as User,
        ]);
      },
      // remove: () => {},
      // update: () => {}
    };

    fakerAuthService = {
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: uuidv4(), email, password } as User);
      },
      // signUp: () => {}
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakerAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const testEmail = faker.internet.email(
      faker.name.firstName(),
      faker.name.lastName(),
    );
    const users = await controller.findAllUsers(testEmail);

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(testEmail);
  });

  it('findUser returns a single user with given id', async () => {
    const user = await controller.findUser(uuidv4());
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id not found', async () => {
    fakeUsersService.findOne = () => null;
    expect.assertions(1);
    try {
      await controller.findUser(uuidv4());
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('signIn updates session object and returns user', async () => {
    const testBody = {
      email: faker.internet.email(
        faker.name.firstName(),
        faker.name.lastName(),
      ),
      password: faker.internet.password(),
    };
    const session = { id: '' };
    const user = await controller.signin(testBody, session);

    expect(user.id).toBeDefined();
    expect(session.id).toEqual(user.id);
  });
});
