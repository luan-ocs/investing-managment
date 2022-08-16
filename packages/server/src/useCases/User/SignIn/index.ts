import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import { TokenGenerator } from './TokenGenerator';

type RequestProps = {
  email: string;
  password: string;
};

export class SignIn {
  constructor(private repository: IUserRepository) {}
  async execute(props: RequestProps) {
    try {
      const user = await this.repository.findByEmail(props.email);

      if (!bcrypt.compareSync(props.password, user.password)) {
        throw new EmailOrPasswordIncorrectError();
      }

      return new TokenGenerator(user).generate();
    } catch (error) {
      throw error;
    }
  }
}

export class EmailOrPasswordIncorrectError extends Error {
  constructor() {
    super();
    super.message = 'Email or password is incorrect';
  }
}
