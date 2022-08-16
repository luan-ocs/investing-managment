import { User } from '../../../entities/User';
import { DTO } from './DTO';

export type userFromSQL = {
  name: string;
  id: string;
  email: string;
  password: string;
  admin: boolean;
};

export class knexuserDTO implements DTO<userFromSQL, User> {
  toDatabase(user: User): userFromSQL {
    return {
      name: user.name,
      id: user.id,
      email: user.email,
      password: user.password,
      admin: user.admin,
    };
  }

  fromDatabase(user: userFromSQL) {
    const { name, email, password, id, admin } = user;
    return new User({ name, email, password, admin }, id);
  }
}
