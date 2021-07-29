import { User } from "../../model/User";
import { Result } from "../../model/utils/Result";

// リポジトリ作成
export interface IUserService {
  getAll(): Promise<Result<User[]>>;
  get(id: number): Promise<Result<User>>;
  create(user: User): Promise<Result<number>>;
  update(id: number, user: User): Promise<Result<User>>;
  delete(id: number): Promise<Result<number>>;
}
