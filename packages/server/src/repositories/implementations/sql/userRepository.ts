import { User } from '../../../entities/User';
import { IUserRepository } from '../../interfaces/IUserRepository';
import knex from 'knex';
import config from '../../../../knexfile';
import { UserNotFoundError } from '../../../test/repositories/InMemoryUserRepository';
import {
  knexuserDTO,
  userFromSQL,
} from '../../../infra/database/DTO/knexUserDTO';

const db = knex(config);

export class userRepository implements IUserRepository {
  constructor(private transferFunction: knexuserDTO) {}

  async findById(id: string): Promise<User> {
    const user = await db<userFromSQL>('users').where({ id }).first();

    if (!user) {
      throw new UserNotFoundError();
    }

    return new Promise((resolve) =>
      resolve(this.transferFunction.fromDatabase(user)),
    );
  }

  async findByEmail(email: string): Promise<User> {
    const user = await db<userFromSQL>('users').where({ email }).first();

    if (!user) {
      throw new UserNotFoundError();
    }

    return new Promise((resolve) =>
      resolve(this.transferFunction.fromDatabase(user)),
    );
  }

  async addUser(user: User): Promise<boolean> {
    try {
      await this.findByEmail(user.email);
      return new Promise((resolve) => resolve(false));
    } catch (error) {}

    await db('users').insert(this.transferFunction.toDatabase(user));

    return new Promise((resolve) => resolve(true));
  }
  async deleteById(id: string): Promise<boolean> {
    try {
      await this.findById(id);
    } catch (error) {
      return new Promise((resolve) => resolve(false));
    }

    await db('users').delete().where({ id }).first();

    return new Promise((resolve) => resolve(true));
  }
  async update(user: User): Promise<boolean> {
    const updated = await db('users')
      .update(this.transferFunction.toDatabase(user))
      .where({ id: user.id })
      .first();

    return new Promise((resolve) => resolve(updated === 1));
  }
}
