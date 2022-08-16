import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';

type ReadProps = {
  email?: string;
  id?: string;
};

export class ReadUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userProps: ReadProps) {
    if (!userProps.id && !userProps.email) {
      throw new MissingParamError();
    }
    try {
      if (userProps.id) {
        const user = await this.userRepository.findById(userProps.id);
        return user;
      } else if (userProps.email) {
        const user = await this.userRepository.findByEmail(userProps.email);
        return user;
      }
    } catch (error) {
      throw error;
    }
  }
}

export class MissingParamError extends Error {
  constructor() {
    super();
    super.message = 'at least one email or id is missing';
  }
}
