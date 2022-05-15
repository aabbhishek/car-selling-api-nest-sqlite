import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entities';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // Create a fake copy of the user service
    fakeUserService = {
      // A Fake implementation of UserService
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: uuidv4(), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          //* If Requested for UserService provides with fakerUserService
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('abc@test.com', 'testPassword');

    expect(user.password).not.toEqual('testPassword');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  /*
  ! Can we used with Done as well instead of using  => async function 
  it('throws an error if user signs up with email that is in use', (done) => {
    service.signUp('abc@test.com', 'testPassword').then(()=> {
      service.signUp('abc@test.com', 'testPassword').catch(() => {
        done();
      });
    });
  }); */

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('abc@test.com', 'testPassword');
    /**
     * *Use assertions when testing scenarios where exception needs to be thrown
     *
     * Expect.assertions(number) verifies that a certain number of assertions are called during a test.
     * This is often useful when testing asynchronous code, in order to make sure that assertions
     * in a callback actually got called.
     * expect.assertions(NO_OF_EXPECTATIONS);
     */
    expect.assertions(1);
    try {
      await service.signUp('abc@test.com', 'testPassword');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      // expect(err.message).toBeInstanceOf(BadRequestException);
    }
  });

  it('throw if signIn is called with an unused email', (done) => {
    service.signIn('new@test.com', 'password').catch((err) => {
      done();
    });
  });

  it('throw if an invalid password is provided', async () => {
    await service.signUp('abc@test.com', 'savedPassword');
    expect.assertions(1);
    try {
      await service.signIn('abc@test.com', 'password');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('returns a user if correct password is provided', async () => {
    const testUser = { email: 'xyz@test.com', password: 'abc@123' };

    await service.signUp(testUser.email, testUser.password);
    const user = await service.signIn(testUser.email, testUser.password);
    expect(user).toBeDefined();
  });
});
