import { IUserRepository } from "../../repository/user/IUserRepository";
import { User } from "../../model/User";
import { Result } from "../../model/utils/Result";

// サービス作成
export class UserService {
  // IUserRepositoryを引数でもらう
  private repository: IUserRepository;
  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<Result<User[]>> {
    // 返却用のResultオブジェクト作成
    const result: Result<User[]> = {};
    // 値取得
    const users = await this.repository.getAll();
    console.log(users);
    // resultに結果を格納
    result.value = users;
    result.statusCode = 404;

    return result;
  }

  async get(id: number): Promise<User> {
    const user = await this.repository.get(id);
    console.log(user);
    return user;
  }

  async create(user: User): Promise<number> {
    const id = await this.repository.create(user);
    console.log(id);
    return id;
  }

  async update(id: number, user: User): Promise<User> {
    const fromUser = await this.repository.get(id);
    if (fromUser.id == 0) {
      user.id = 0;
      return user;
    }
    const updateUser = await this.repository.update(id, user);
    console.log(updateUser);
    return updateUser;
  }

  async delete(id: number): Promise<number> {
    const fromUser = await this.repository.get(id);
    if (fromUser.id == 0) {
      return fromUser.id;
    }
    return await this.repository.delete(id);
  }
}
