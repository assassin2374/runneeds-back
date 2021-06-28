import express from "express";
import { Client } from "pg";
import { User } from "./model/User";
import { UserRepository } from "./repository/UserRepository";

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

// getAll作成
app.get("/", async (req, res) => {
  // リポジトリにpgConnectを渡す
  const users = await repository.getAll();
  console.log(users);
  res.status(200).json(users);
});

// get作成
app.get("/:id", async (req, res) => {
  // id取得
  const id = parseInt(req.params.id);
  const user = await repository.get(id);

  // if (result.rowCount === 0) {
  //   res.status(404).send();
  //   return;
  // }
  // User型に格納（created_at、updated_atが残るエラー）

  console.log(user);
  res.status(200).json(user);
});

// post作成
app.post("/", async (req, res) => {
  const reqUser = req.body as User;
  delete reqUser.id;
  // SQLクエリ実行
  const sqlQuery = {
    text: `
      INSERT INTO 
        users (name, email, pass) 
      VALUES 
        ($1, $2, $3)
      RETURNING id
      `,
    values: [reqUser.name, reqUser.email, reqUser.pass],
  };
  const result = await client.query<{ id: number }>(sqlQuery);

  const id = result.rows[0].id;
  console.log(id);

  res.status(201).json(id);
});

// put作成
app.put("/:id", async (req, res) => {
  // id取得
  const id = parseInt(req.params.id);
  const reqUser = req.body as User;
  delete reqUser.id;

  // SQLクエリ実行
  const sqlQuery = {
    text: `
      UPDATE
        users
      SET
        name = $1,
        email = $2,
        pass = $3
      WHERE
        id = $4;
      `,
    values: [reqUser.name, reqUser.email, reqUser.pass, id],
  };
  await client.query<User>(sqlQuery);
  // User型に格納（手動で格納、ホントはSELECTで返却値をもらう方が正しい）
  const user = reqUser;
  user.id = id;
  console.log(user);

  res.status(200).json(user);
});

// delete作成
app.delete("/:id", async (req, res) => {
  // id取得
  const id = parseInt(req.params.id);

  // SQLクエリ実行
  const sqlQuery = {
    text: "DELETE FROM users where id=$1",
    values: [id],
  };
  await client.query<User>(sqlQuery);

  console.log(id);

  res.status(204).json(id);
});

// Webサーバ起動
app.listen(port);
console.log(`listen on port ${port} `);
