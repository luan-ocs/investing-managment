import { UpdateUser } from '.';
import { User } from '../../../entities/User';
import { InMemoryUserRepository } from '../../../test/repositories/InMemoryUserRepository';

describe('Use Case: UpdateUser ===>', () => {
  it('should be able to update an user', async () => {
    const repository = new InMemoryUserRepository();

    const testUser = new User({
      name: 'test',
      email: 'test1@email.com',
      password: 'test1password',
    });

    const sut = new UpdateUser(repository);

    await repository.addUser(testUser);

    await sut.execute(testUser.id, {
      name: 'test2',
      email: 'test2@email.com',
      password: 'test2password',
    });

    const userFromRepository = await repository.findById(testUser.id);

    expect(userFromRepository).toStrictEqual(testUser);
  });

  it("shouldn't be able to update an user that not exists", async () => {
    const repository = new InMemoryUserRepository();
    const sut = new UpdateUser(repository);
    const result = await sut.execute('521ABX', {
      name: 'test2',
      email: 'test2@email.com',
      password: 'test2password',
    });

    expect(result).toStrictEqual(false);
  });
});
