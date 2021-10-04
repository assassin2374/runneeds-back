import express from "express";
import { Client } from "pg";
import { UserRepository } from "./repository/user/UserRepository";
import { UserService } from "./service/user/UserService";
import { UserController } from "./controller/user/UserController";
import { RundataRepository } from "./repository/rundata/RundataRepository";
import { RundataService } from "./service/rundata/RundataService";
import { RundataController } from "./controller/rundata/RundataController";

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
const controller = new UserController(service);
const rundataRepository = new RundataRepository(client);
const rundataService = new RundataService(rundataRepository);
const rundataController = new RundataController(rundataService);

app.use("/api/", controller.router, rundataController.router);

// Webサーバ起動
app.listen(port);
console.log(`listen on port ${port} `);
