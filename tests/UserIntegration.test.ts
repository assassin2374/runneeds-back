import { User, validUser } from "../src/model/User";
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
  name: "name_1",
  email: "email_1",
  pass: "pass_1",
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

describe("userAPI getAllテスト", () => {
  it("getAll、正常系(複数件突っ込み、複数件取得)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.get("/api/users/", async (req, res) => {
      const users = await userService.getAll();

      console.log(users);
      res.status(200).json(users);
    });

    // Userデータを複数件insertする（今回3件）
    const testNum = 3;
    const createdUserList = await createUserListData(testNum, userRepository);
    const response = await request(app).get("/api/users");

    //ステータスのチェック
    expect(200).toBe(response.statusCode);

    const userList = response.body as User[];
    expect(testNum).toBe(userList.length);
    console.log(createdUserList);
    console.log(userList);

    const userMap = createUserMap(userList);
    // 項目の検証
    createdUserList.forEach((createdUser) => {
      const id = createdUser.id as number;
      const user = userMap.get(id) as User;
      expect(createdUser.id).toBe(user.id);
      expect(createdUser.name).toBe(user.name);
      expect(createdUser.email).toBe(user.email);
      expect(createdUser.pass).toBe(user.pass);
    });
  });
});

describe("userAPI postテスト", () => {
  it("post、正常系(新しいユーザーデータ作成)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    // body-parserの設定
    // URLエンコードされたデータの解析を許可
    app.use(express.urlencoded({ extended: true }));
    // JSONを解析
    app.use(express.json());
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.post("/api/users/", async (req, res) => {
      const reqUser = req.body as User;
      if (!validUser(reqUser)) {
        res.status(400).json("中身がないです");
        return;
      }
      delete reqUser.id;
      // SQLクエリ実行
      const id = await userService.create(reqUser);

      console.log(id);
      res.status(201).json(id);
    });
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

    const response = await request(app).post("/api/users/").send(testUser);

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
  it("post、異常系(空のユーザーデータ作成)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    // body-parserの設定
    // URLエンコードされたデータの解析を許可
    app.use(express.urlencoded({ extended: true }));
    // JSONを解析
    app.use(express.json());
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.post("/api/users/", async (req, res) => {
      const reqUser = req.body as User;
      if (!validUser(reqUser)) {
        res.status(400).json("中身がないです");
        return;
      }
      delete reqUser.id;
      // SQLクエリ実行
      const id = await userService.create(reqUser);

      console.log(id);
      res.status(201).json(id);
    });
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

    const response = await request(app).post("/api/users/").send();

    //ステータスのチェック
    expect(400).toBe(response.statusCode);
  });
});

describe("userAPI putテスト", () => {
  it("put、正常系(1件突っ込み、1件編集)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    // body-parserの設定
    // URLエンコードされたデータの解析を許可
    app.use(express.urlencoded({ extended: true }));
    // JSONを解析
    app.use(express.json());
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.put("/api/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const reqUser = req.body as User;
      if (!validUser(reqUser)) {
        res.status(400).json("中身がないです");
        return;
      }
      delete reqUser.id;
      const user = await userService.update(id, reqUser);
      console.log(user);
      if (user.id == 0) {
        res.status(404).json("id not found");
        return;
      }
      res.status(200).json(user);
    });

    // Userデータを1件insertする
    const createdUser = await createUserData(userRepository);
    const editUser: User = {
      name: "edit_name",
      email: "edit_email",
      pass: "edit_pass",
    };
    // idはnumber型で固定（null回避）
    const id = createdUser.id as number;
    const response = await request(app).put(`/api/users/${id}`).send(editUser);

    //ステータスのチェック
    expect(200).toBe(response.statusCode);

    const user = response.body as User;
    // 項目の検証
    expect(id).toBe(user.id);
    expect(editUser.name).toBe(user.name);
    expect(editUser.email).toBe(user.email);
    expect(editUser.pass).toBe(user.pass);
  });

  it("put、異常系(0件突っ込み、0件編集+エラーメッセージ)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    // body-parserの設定
    // URLエンコードされたデータの解析を許可
    app.use(express.urlencoded({ extended: true }));
    // JSONを解析
    app.use(express.json());
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.put("/api/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const reqUser = req.body as User;
      if (!validUser(reqUser)) {
        res.status(400).json("中身がないです");
        return;
      }
      delete reqUser.id;
      const user = await userService.update(id, reqUser);
      console.log(user);
      if (user.id == 0) {
        res.status(404).json("id not found");
        return;
      }
      res.status(200).json(user);
    });

    const editUser: User = {
      name: "edit_name",
      email: "edit_email",
      pass: "edit_pass",
    };
    // idはnumber型で固定（null回避）
    const id = 0;
    const response = await request(app).put(`/api/users/${id}`).send(editUser);

    //ステータスのチェック
    expect(404).toBe(response.statusCode);
  });

  it("put、異常系(1件突っ込み、空データ編集+エラーメッセージ)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    // body-parserの設定
    // URLエンコードされたデータの解析を許可
    app.use(express.urlencoded({ extended: true }));
    // JSONを解析
    app.use(express.json());
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.put("/api/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const reqUser = req.body as User;
      if (!validUser(reqUser)) {
        res.status(400).json("中身がないです");
        return;
      }
      delete reqUser.id;
      const user = await userService.update(id, reqUser);
      console.log(user);
      if (user.id == 0) {
        res.status(404).json("id not found");
        return;
      }
      res.status(200).json(user);
    });

    // Userデータを1件insertする
    const createdUser = await createUserData(userRepository);

    // idはnumber型で固定（null回避）
    const id = createdUser.id as number;
    const response = await request(app).put(`/api/users/${id}`).send();

    //ステータスのチェック
    expect(400).toBe(response.statusCode);
  });
});

describe("userAPI deleteテスト", () => {
  it("delete、正常系(1件突っ込み、1件削除)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    // body-parserの設定
    // URLエンコードされたデータの解析を許可
    app.use(express.urlencoded({ extended: true }));
    // JSONを解析
    app.use(express.json());
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.delete("/api/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const lostId = await userService.delete(id);

      console.log(lostId);
      if (lostId == 0) {
        res.status(404).json("not found");
        return;
      }
      res.status(204).json();
    });
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

    // Userデータを1件insertする
    const createdUser = await createUserData(userRepository);
    // idはnumber型で固定（null回避）
    const id = createdUser.id as number;
    const response = await request(app).delete(`/api/users/${id}`);

    //ステータスのチェック
    expect(204).toBe(response.statusCode);

    const getResponse = await request(app).get(`/api/users/${id}`);
    // 削除されたデータのステータスのチェック
    expect(404).toBe(getResponse.statusCode);
  });

  it("delete、異常系(0件突っ込み、0件削除+エラーメッセージ)", async () => {
    //expressのアプリケーション実体化
    const app: Application = express();
    // body-parserの設定
    // URLエンコードされたデータの解析を許可
    app.use(express.urlencoded({ extended: true }));
    // JSONを解析
    app.use(express.json());
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);
    const userService = new UserService(userRepository);
    //ユーザーAPIをエンドポイントに登録
    app.delete("/api/users/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const lostId = await userService.delete(id);

      console.log(lostId);
      if (lostId == 0) {
        res.status(404).json("not found");
        return;
      }
      res.status(204).json();
    });

    // idはnumber型で固定（null回避）
    const id = 0;
    const response = await request(app).delete(`/api/users/${id}`);

    //ステータスのチェック
    expect(404).toBe(response.statusCode);
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

/**
 * テスト用のUserデータを複数作成する
 * @returns 作成されたUserListデータ
 */
async function createUserListData(
  num: number,
  repository: UserRepository
): Promise<User[]> {
  const userlist: User[] = [];
  // index分データ追加
  for (let index = 0; index < num; index++) {
    // サンプルのUserデータをInsertする。
    userlist[index] = {
      name: `name_${index}`,
      email: `email_${index}`,
      pass: `pass_${index}`,
    };
    //データベースに追加
    const result = await repository.create(userlist[index]);
    userlist[index].id = result;
  }

  // 作成したUserデータを返却する。
  return userlist;
}

/**
 * UserデータからidをキーとするMapを作成する
 * @returns 作成されたUserMapデータ
 */
function createUserMap(users: User[]): Map<number, User> {
  const result = new Map<number, User>();

  users.forEach((user) => {
    const userId = user.id as number;
    result.set(userId, user);
  });

  return result;
}
