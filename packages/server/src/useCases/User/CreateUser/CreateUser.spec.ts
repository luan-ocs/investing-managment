import { CreateUser, UserAlreadyCreatedError } from '.';
import { InMemoryUserRepository } from '../../../test/repositories/InMemoryUserRepository';

describe('Use Case: Create user ===>', () => {
  it('should be able to create user', async () => {
    const testRepository = new InMemoryUserRepository();
    const sut = new CreateUser(testRepository);

    const id = await sut.execute({
      name: 'test',
      email: 'test@mail.com',
      password: 'abc1234',
    });

    const userInRepository = await testRepository.findByEmail('test@mail.com');

    expect(id).toStrictEqual(userInRepository.id);
  });

  it("shouldn't be able to create an user that already created", async () => {
    const testRepository = new InMemoryUserRepository();
    const sut = new CreateUser(testRepository);

    const testUser = {
      name: 'test',
      email: 'test@mail.com',
      password: 'abc1234',
    };

    await sut.execute(testUser);

    try {
      await sut.execute(testUser);
    } catch (error) {
      expect(error).toStrictEqual(new UserAlreadyCreatedError());
    }

    expect.assertions(1);
  });

  it('should encrypt password, when user is created', async () => {
    const testRepository = new InMemoryUserRepository();
    const sut = new CreateUser(testRepository);

    const testUser = {
      name: 'test',
      email: 'test@mail.com',
      password: 'abc1234',
    };

    const id = await sut.execute(testUser);

    const user = await testRepository.findById(id);

    expect(user.password).not.toEqual('abc1234');
  });
});
