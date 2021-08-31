import { Router } from "express";
import { IUserService } from "../../service/user/IUserService";
import { User, validUser } from "../../model/User";
import { HttpStatusCode } from "../../model/utils/HttpStatusCode";

// サービス作成
export class UserController {
  public router: Router;
  // IUserRepositoryを引数でもらう
  private service: IUserService;
  constructor(service: IUserService) {
    this.router = Router();
    this.service = service;

    // getAll作成
    this.router.get("/users", async (req, res) => {
      // リポジトリにpgConnectを渡す
      const result = await service.getAll();
      const statusCode = result.statusCode as number;
      const users = result.value as User[];
      console.log(users);
      res.status(statusCode).json(users);
    });

    // get作成
    this.router.get("/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const result = await service.get(id);
      const statusCode = result.statusCode as number;
      const user = result.value as User;

      console.log(user);
      if (statusCode == HttpStatusCode.NotFound) {
        res.status(statusCode).json("not found");
        return;
      }
      res.status(statusCode).json(user);
    });

    // post作成
    this.router.post("/users/", async (req, res) => {
      const reqUser = req.body as User;
      if (validUser(reqUser) == false) {
        res.status(HttpStatusCode.BadRequest).json("中身がないです");
        return;
      }
      delete reqUser.id;
      // SQLクエリ実行
      const result = await service.create(reqUser);
      const statusCode = result.statusCode as number;
      const id = result.value as number;

      console.log(id);
      res.status(statusCode).json(id);
    });

    // put作成
    this.router.put("/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const reqUser = req.body as User;
      if (validUser(reqUser) == false) {
        res.status(HttpStatusCode.BadRequest).json("中身がないです");
        return;
      }
      delete reqUser.id;

      // SQLクエリ実行
      const result = await service.update(id, reqUser);
      const statusCode = result.statusCode as number;
      const user = result.value as User;

      console.log(user);
      if (statusCode == HttpStatusCode.NotFound) {
        res.status(statusCode).json("id not found");
        return;
      }
      res.status(statusCode).json(user);
    });

    // delete作成
    this.router.delete("/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);

      // SQLクエリ実行
      const result = await service.delete(id);
      const statusCode = result.statusCode as number;
      const lostId = result.value as number;

      console.log(lostId);
      if (statusCode == HttpStatusCode.NotFound) {
        res.status(statusCode).json("id not found");
        return;
      }
      res.status(statusCode).json();
    });
  }
}
