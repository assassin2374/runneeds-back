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
  const users = await service.getAll();
  console.log(users);
  res.status(200).json(users);
});

// get作成
app.get("/api/users/:id", async (req, res) => {
  // id取得
  const id = parseInt(req.params.id);
  const user = await service.get(id);

  console.log(user);
  if (user.id == 0) {
    res.status(404).json("not found");
    return;
  }
  res.status(200).json(user);
});

// post作成
app.post("/api/users/", async (req, res) => {
  const reqUser = req.body as User;
  delete reqUser.id;
  // SQLクエリ実行
  const id = await service.create(reqUser);

  console.log(id);
  res.status(201).json(id);
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
