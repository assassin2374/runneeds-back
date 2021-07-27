import { User } from "../../model/User";
import { Result } from "../../model/utils/Result";

// リポジトリ作成
export interface IUserService {
  getAll(): Promise<Result<User[]>>;
  get(id: number): Promise<User>;
  create(user: User): Promise<number>;
  update(id: number, user: User): Promise<User>;
  delete(id: number): Promise<number>;
}
