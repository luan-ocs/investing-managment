import { User } from '../../entities/User';
export interface IUserRepository {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  addUser(user: User): Promise<boolean>;
  deleteById(id: string): Promise<boolean>;
  update(user: User): Promise<boolean>;
}
