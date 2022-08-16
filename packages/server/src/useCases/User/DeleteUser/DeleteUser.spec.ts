import { DeleteUser } from '.';
import { InMemoryUserRepository } from '../../../test/repositories/InMemoryUserRepository';
import { CreateUser } from '../CreateUser';

describe('Use Case: Delete User ===>', () => {
  it('should be able to delete an created user', async () => {
    const mockUser = {
      name: 'test',
      email: 'mail@mail.com',
      password: '123456',
    };
    const testRepository = new InMemoryUserRepository();
    const addUserUseCase = new CreateUser(testRepository);

    const userId = await addUserUseCase.execute(mockUser);

    const sut = new DeleteUser(testRepository);

    const isRemoved = await sut.execute(userId);

    expect(isRemoved).toStrictEqual(true);
  });

  it("shouldn't be able to delete an user that not exists", async () => {
    const testRepository = new InMemoryUserRepository();
    const sut = new DeleteUser(testRepository);

    const isRemoved = await sut.execute('123456');

    expect(isRemoved).toStrictEqual(false);
  });
});
