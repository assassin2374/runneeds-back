import { User } from "../../model/User";

// リポジトリ作成
export interface IUserRepository {
  getAll(): Promise<User[]>;
  get(id: number): Promise<User>;
  create(user: User): Promise<number>;
  update(id: number, user: User): Promise<User>;
  delete(id: number): Promise<number>;
}
