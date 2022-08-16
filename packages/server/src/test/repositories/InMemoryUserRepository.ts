import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }
  async addUser(user: User): Promise<boolean> {
    try {
      await this.findByEmail(user.email);
      return new Promise((resolve) => resolve(false));
    } catch (error) {}

    this.users.push(user);

    return new Promise((resolve) => resolve(true));
  }

  async findById(id: string): Promise<User> {
    const user = this.users.filter((u) => u.id == id)[0];

    if (!user) {
      throw new UserNotFoundError();
    }

    return new Promise((resolve) => resolve(user));
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.filter((u) => u.email == email)[0];

    if (!user) {
      throw new UserNotFoundError();
    }

    return new Promise((resolve) => resolve(user));
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.findById(id);
    } catch (error) {
      return new Promise((resolve) => resolve(false));
    }

    this.users = this.users.filter((user) => user.id !== id);

    return new Promise((resolve) => resolve(true));
  }

  async update(user: User): Promise<boolean> {
    this.users.filter((u, index) => {
      if (user.id == u.id) {
        this.users[index] = user;
      }
    });

    return new Promise((resolve) => resolve(true));
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super();
    super.message = 'user not found';
  }
}
