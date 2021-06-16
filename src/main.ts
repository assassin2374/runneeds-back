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
  id?: number;
  name: string;
  email: string;
  pass: string;
};

// getAll作成
app.get("/", async (req, res) => {
  // SQLクエリ実行
  const sqlQuery = {
    text: "SELECT * FROM users",
  };
  const client = await pgConnect();
  const result = await client.query<User>(sqlQuery);
  // User型に格納（created_at、updated_atが残るエラー）
  const users = result.rows.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      pass: user.pass,
    } as User;
  });
  console.log(users);

  res.status(200).json(users);
});

// get作成
app.get("/:id", async (req, res) => {
  // id取得
  const id = parseInt(req.params.id);
  // SQLクエリ実行
  const sqlQuery = {
    text: "SELECT * FROM users WHERE id=($1)",
    values: [id],
  };
  const client = await pgConnect();
  const result = await client.query<User>(sqlQuery);
  // User型に格納（created_at、updated_atが残るエラー）
  const user = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    pass: result.rows[0].pass,
  };

  console.log(user);

  res.status(200).json(user);
});

// post作成
app.post("/", async (req, res) => {
  const user = req.body as User;
  delete user.id;
  // SQLクエリ実行
  const sqlQuery = {
    text: `
      INSERT INTO 
        users (name, email, pass) 
      VALUES 
        ($1, $2, $3)
      RETURNING id
      `,
    values: [user.name, user.email, user.pass],
  };
  const client = await pgConnect();
  const result = await client.query<{ id: number }>(sqlQuery);

  const id = result.rows[0].id;
  console.log(id);

  // sendは文字列しか送れないため
  res.status(200).json(id);
});

// // put作成
// app.put("/:id", async (req, res) => {
//   // id取得
//   const id = parseInt(req.params.id);
//   const date = req.body;

//   // SQLクエリ実行
//   const sqlQuery = {
//     text: "UPDATE users SET ($1) WHERE id=($2)",
//     values: [date, id],
//   };
//   const client = await pgConnect();
//   const result = await client.query<User>(sqlQuery);
//   // User型に格納（created_at、updated_atが残るエラー）
//   const user = result.rows[0];

//   console.log(user);

//   res.status(200).json(user);
// });

// // delete作成
// app.delete("/:id", async (req, res) => {
//   // id取得
//   const id = parseInt(req.params.id);

//   // SQLクエリ実行
//   const sqlQuery = {
//     text: "DELETE FROM user where id=($1)",
//     values: [id],
//   };
//   const client = await pgConnect();
//   const result = await client.query<User>(sqlQuery);
//   // User型に格納（created_at、updated_atが残るエラーの）
//   const user = result.rows[0];

//   console.log(user);

//   res.status(200).json(user);
// });

// Webサーバ起動
app.listen(port);
console.log(`listen on port ${port} `);
