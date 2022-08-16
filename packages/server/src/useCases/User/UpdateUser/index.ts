import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';
type userProps = {
  name: string;
  email: string;
  password: string;
};
export class UpdateUser {
  constructor(private repository: IUserRepository) {}

  async execute(id: string, { name, email, password }: userProps) {
    try {
      const finded = await this.repository.findById(id);

      if (name) {
        finded.name = name;
      }
      if (email) {
        finded.email = email;
      }
      if (password) {
        finded.password = password;
      }

      const isUpdated = await this.repository.update(finded);

      return isUpdated;
    } catch (error) {
      return false;
    }
  }
}
