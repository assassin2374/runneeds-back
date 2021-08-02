import { IUserService } from "../../src/service/user/IUserService";
import { User } from "../../src/model/User";

// サービス作成
export class UserController {
  // IUserRepositoryを引数でもらう
  private repository: IUserService;
  constructor(repository: IUserService) {
    this.repository = repository;
  }

  // getAll作成
app.get("/api/users", async (req, res) => {
  // リポジトリにpgConnectを渡す
  const result = await service.getAll();
  const statusCode = result.statusCode as number;
  const users = result.value as User[];
  console.log(users);
  res.status(statusCode).json(users);
});
}
