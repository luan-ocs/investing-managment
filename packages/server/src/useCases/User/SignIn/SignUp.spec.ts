import { EmailOrPasswordIncorrectError, SignIn } from '.';
import {
  InMemoryUserRepository,
  UserNotFoundError,
} from '../../../test/repositories/InMemoryUserRepository';
import { CreateUser } from '../CreateUser';

describe('Use Case: User signUp ===>', () => {
  it("shouldn't be able to generate a token for an user that not exists", async () => {
    const repository = new InMemoryUserRepository();

    const sut = new SignIn(repository);

    try {
      await sut.execute({ email: 'test@mail.com', password: '123abc' });
    } catch (error) {
      expect(error).toStrictEqual(new UserNotFoundError());
    }

    expect.assertions(1);
  });

  it("shouldn't be able to generate a token for an user with wrong password", async () => {
    const repository = new InMemoryUserRepository();
    const createUser = new CreateUser(repository);

    const user = {
      name: 'test',
      email: 'test@mail.com',
      password: '123abc',
    };

    await createUser.execute(user);

    const sut = new SignIn(repository);

    try {
      await sut.execute({
        email: 'test@mail.com',
        password: 'abc123',
      });
    } catch (error) {
      expect(error).toStrictEqual(new EmailOrPasswordIncorrectError());
    }

    expect.assertions(1);
  });

  it('should be able to generate an token when pass right email and password', async () => {
    const repository = new InMemoryUserRepository();
    const createUser = new CreateUser(repository);
    const user = {
      name: 'test',
      email: 'test@mail.com',
      password: '123abc',
    };
    const id = await createUser.execute(user);

    const sut = new SignIn(repository);

    const token = await sut.execute({
      email: 'test@mail.com',
      password: '123abc',
    });

    expect(token.email).toStrictEqual('test@mail.com');
    expect(token.name).toStrictEqual('test');
    expect(token.id).toStrictEqual(id);

    expect.assertions(3);
  });
});
