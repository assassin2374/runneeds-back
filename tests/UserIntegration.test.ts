import { User } from "../src/model/User";
import { UserRepository } from "../src/repository/user/UserRepository";
import { UserService } from "../src/service/user/UserService";
import { TestRepository } from "./common/TestRepository";
import express, { Application } from "express";
import { Client } from "pg";
import request from "supertest";

// データベース設定（後々別ファイルに移行したい）
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

const testRepository = new TestRepository(client);

// サンプルのUserデータをInsertする。
const testUser: User = {
  name: `name_1`,
  email: `email_1`,
  pass: `pass_1`,
};

// テスト開始時にデータベースクリア
beforeEach(async () => {
  // Userテーブルの初期化除(データを空にする)
  await testRepository.clearTable("users");
});

// テスト終了時にデータベースクリア
afterEach(async () => {
  // Userテーブルの削除(データを空にする)
  await testRepository.clearTable("users");
});

// 最後にDBを閉じる
afterAll(async () => {
  await client.end();
});

describe("userAPI getテスト", () => {
  it("get、正常系(1件突っ込み、1件取得)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.get("/api/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const user = await userService.get(id);

      console.log(user);
      if (user.id == 0) {
        res.status(404).json("not found");
        return;
      }
      res.status(200).json(user);
    });

    // Userデータを1件insertする
    const createdUser = await createUserData(userRepository);
    // idはnumber型で固定（null回避）
    const id = createdUser.id as number;
    const response = await request(app).get(`/api/users/${id}`);

    //ステータスのチェック
    expect(200).toBe(response.statusCode);

    const user = response.body as User;
    // 項目の検証
    expect(createdUser.id).toBe(user.id);
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.pass).toBe(user.pass);
  });

  it("get、異常系(0件突っ込み、0件取得+エラーメッセージ)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    //ユーザーAPIのを作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    // get作成
    app.get("/api/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const user = await userService.get(id);

      console.log(user);
      if (user.id == 0) {
        res.status(404).json("not found");
        return;
      }
      res.status(200).json(user);
    });

    // idは-1を使用する（存在しないid）
    const id = -1;
    const response = await request(app).get(`/api/users/${id}`);

    //ステータスのチェック
    expect(404).toBe(response.statusCode);
  });
});

describe("userAPI postテスト", () => {
  it("post、正常系(新しいユーザーデータ作成)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.post("/api/users/", async (req, res) => {
      const reqUser = req.body as User;
      delete reqUser.id;
      // SQLクエリ実行
      const id = await userService.create(reqUser);

      console.log(id);
      res.status(201).json(id);
    });

    const postUser = testUser;
    const response = await request(app).post("/api/users/").send(postUser);

    //ステータスのチェック
    expect(201).toBe(response.statusCode);

    // idはnumber型で固定（null回避）
    const responseId = response.body as number;

    // idでgetする
    const responseUser = await request(app).get(`/api/users/${responseId}`);
    const user = responseUser.body as User;

    // 項目の検証
    expect(testUser.name).toBe(user.name);
    expect(testUser.email).toBe(user.email);
    expect(testUser.pass).toBe(user.pass);
  });
});

/**
 * テスト用のUserデータを作成する
 * @returns 作成されたUserデータ
 */
async function createUserData(repository: UserRepository): Promise<User> {
  // サンプルのUserデータをInsertする。
  const user = testUser;
  //データベースに追加
  const result = await repository.create(user);
  user.id = result;

  // 作成したUserデータを返却する。
  return user;
}
