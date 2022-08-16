import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';

export class DeleteUser {
  private userRepository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.userRepository = repository;
  }

  async execute(id: string) {
    const isRemoved = await this.userRepository.deleteById(id);
    return isRemoved;
  }
}
