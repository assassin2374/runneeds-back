import { IUserRepository } from "../../repository/user/IUserRepository";
import { User, validUser } from "../../model/User";
import { Result } from "../../model/utils/Result";
import { HttpStatusCode } from "../../model/utils/HttpStatusCode";

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
    result.statusCode = HttpStatusCode.OK;

    return result;
  }

  async get(id: number): Promise<Result<User>> {
    // 返却用のResultオブジェクト作成
    const result: Result<User> = {};
    // 値取得
    const user = await this.repository.get(id);
    console.log(user);

    // resultに結果を格納
    if (validUser(user) == false) {
      result.statusCode = HttpStatusCode.NotFound;
      return result;
    }
    result.value = user;
    result.statusCode = HttpStatusCode.OK;
    return result;
  }

  async create(user: User): Promise<Result<number>> {
    // 返却用のResultオブジェクト作成
    const result: Result<number> = {};
    // 値取得
    const id = await this.repository.create(user);
    console.log(id);
    // resultに結果を格納
    result.value = id;
    result.statusCode = HttpStatusCode.Created;
    return result;
  }

  async update(id: number, user: User): Promise<Result<User>> {
    // 返却用のResultオブジェクト作成
    const result: Result<User> = {};
    // 値取得
    const fromUser = await this.repository.get(id);
    if (validUser(fromUser) == false) {
      // resultに結果を格納
      result.statusCode = HttpStatusCode.NotFound;
      return result;
    }
    // 値取得
    const updateUser = await this.repository.update(id, user);
    console.log(updateUser);
    // resultに結果を格納
    result.value = updateUser;
    result.statusCode = HttpStatusCode.OK;
    return result;
  }

  async delete(id: number): Promise<Result<number>> {
    // 返却用のResultオブジェクト作成
    const result: Result<number> = {};
    const fromUser = await this.repository.get(id);
    if (fromUser.id == 0) {
      // resultに結果を格納
      result.statusCode = HttpStatusCode.NotFound;
      return result;
    }
    // resultに結果を格納
    result.value = await this.repository.delete(id);
    result.statusCode = HttpStatusCode.NoContent;
    return result;
  }
}
