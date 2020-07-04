import { User } from '../entities/User'

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  createNewUser(user: User): Promise<User>;
}
