import express from "express";
import { Client } from "pg";
import { User } from "./model/User";
import { UserRepository } from "./repository/user/UserRepository";
import { UserService } from "./service/user/UserService";

// Webサーバーのインスタンス化
const app = express();

// body-parserの設定
// URLエンコードされたデータの解析を許可
app.use(express.urlencoded({ extended: true }));
// JSONを解析
app.use(express.json());

// port番号を指定
const port = process.env.PORT || 3000;

// Connectionを定義する
// データベース設定
const client = new Client({
  host: "localhost",
  database: "runneeds",
  user: "root",
  password: "root",
  port: 5432,
});
// データベース接続
client
  .connect()
  .then(() => console.log("postgres connect success!"))
  .catch((err) => console.log(err));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
// pgConnect();

const repository = new UserRepository(client);
const service = new UserService(repository);

// getAll作成
app.get("/api/users", async (req, res) => {
  // リポジトリにpgConnectを渡す
  const result = await service.getAll();
  const statusCode = result.statusCode as number;
  const users = result.value as User[];
  console.log(users);
  res.status(statusCode).json(users);
});

// get作成
app.get("/api/users/:id", async (req, res) => {
  // id取得
  const id = parseInt(req.params.id);
  const result = await service.get(id);
  const statusCode = result.statusCode as number;
  const user = result.value as User;

  console.log(user);
  if (user.id == 0) {
    res.status(statusCode).json("not found");
    return;
  }
  res.status(statusCode).json(user);
});

// post作成
app.post("/api/users/", async (req, res) => {
  const reqUser = req.body as User;
  if (!reqUser) {
    res.status(400).json("中身がないです");
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
app.put("/api/users/:id", async (req, res) => {
  // id取得
  const id = parseInt(req.params.id);
  const reqUser = req.body as User;
  delete reqUser.id;

  // SQLクエリ実行
  const user = await service.update(id, reqUser);

  console.log(user);
  if (user.id == 0) {
    res.status(404).json("id not found");
    return;
  }
  res.status(200).json(user);
});

// delete作成
app.delete("/api/users/:id", async (req, res) => {
  // id取得
  const id = parseInt(req.params.id);

  // SQLクエリ実行
  const lostId = await service.delete(id);
  if (lostId == 0) {
    res.status(404).json("id not found");
    return;
  }
  console.log(lostId);
  res.status(204).json();
});

// Webサーバ起動
app.listen(port);
console.log(`listen on port ${port} `);
