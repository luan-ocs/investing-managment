import { User } from '../../../entities/User';
import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';
import bcrypt from 'bcrypt';

type UserProps = {
  name: string;
  email: string;
  password: string;
  admin: boolean;
};

const encryptPassword = (value: string) => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(value, salt);
};

export class CreateUser {
  private userRepository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.userRepository = repository;
  }
  async execute(props: UserProps) {
    props.password = encryptPassword(props.password);

    const nUser = new User(props);

    const isAdded = await this.userRepository.addUser(nUser);

    if (isAdded) {
      return nUser.id;
    } else {
      throw new UserAlreadyCreatedError();
    }
  }
}

export class UserAlreadyCreatedError extends Error {
  constructor() {
    super('user already created');
  }
}
