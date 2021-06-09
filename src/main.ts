import express from "express";
import { Client } from "pg";

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
const pgConnect = async () => {
  // データベース設定
  const client = new Client({
    host: "localhost",
    database: "runneeds",
    user: "root",
    password: "root",
    port: 5432,
  });
  // データベース接続
  await client.connect();
  return client;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
// pgConnect();

type User = {
  id: number;
  user_name: string;
  email: string;
  pass: string;
};

// API作成
app.get("/", async (req, res) => {
  // SQLクエリ実行
  const sqlQuery = "SELECT * FROM users";
  const client = await pgConnect();
  const result = await client.query<User>(sqlQuery);
  // User型に格納（created_at、updated_atが残るエラーの）
  const users = result.rows.map((user) => {
    return {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      pass: user.pass,
    } as User;
  });
  console.log(users);

  res.status(200).send(users);
});

// Webサーバ起動
app.listen(port);
console.log(`listen on port ${port} `);
