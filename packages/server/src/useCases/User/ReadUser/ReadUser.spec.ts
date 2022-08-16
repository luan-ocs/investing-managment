import { MissingParamError, ReadUser } from '.';
import { User } from '../../../entities/User';
import {
  InMemoryUserRepository,
  UserNotFoundError,
} from '../../../test/repositories/InMemoryUserRepository';

describe('Use Case: Read User ===>', () => {
  it('should be able to read an user that already created by email', async () => {
    const repository = new InMemoryUserRepository();
    const user = new User(
      {
        name: 'test',
        email: 'test@mail.com',
        password: '12345',
      },
      '12345',
    );
    await repository.addUser(user);
    const sut = new ReadUser(repository);

    const finded = await sut.execute({ email: 'test@mail.com' });

    expect(finded?.id).toStrictEqual('12345');
  });

  it('should be able to read an user that already created by id', async () => {
    const repository = new InMemoryUserRepository();
    const testUser = new User({
      name: 'test',
      email: 'test@mail.com',
      password: '12345',
    });

    await repository.addUser(testUser);

    const sut = new ReadUser(repository);

    const finded = await sut.execute({ id: testUser.id });

    expect(testUser).toBe(finded);
  });

  it("shouldn't be able to read an user if not pass email or id", async () => {
    const repository = new InMemoryUserRepository();
    try {
      const sut = new ReadUser(repository);
      await sut.execute({});
    } catch (error) {
      expect(error).toStrictEqual(new MissingParamError());
    }
  });

  it("shouldn't be able to read an user that not exists", async () => {
    const repository = new InMemoryUserRepository();

    try {
      const sut = new ReadUser(repository);
      await sut.execute({ email: 'test' });
    } catch (error) {
      expect(error).toStrictEqual(new UserNotFoundError());
    }
  });
});
