import { Client } from "pg";
import { TestRepository } from "../../common/TestRepository";
import { User, validUser } from "../../../src/model/User";
import { UserRepository } from "../../../src/repository/user/UserRepository";

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
    const userRepository = new UserRepository(client);
    // Userデータを1件insertする
    const createdUser = await createUserData(userRepository);
    const id = createdUser.id as number;
    const user = await userRepository.get(id);
    // 項目の検証
    expect(createdUser.id).toBe(user.id);
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.pass).toBe(user.pass);
  });
  it("get、異常系(存在しないIDを検索、空のuser型取得)", async () => {
    const userRepository = new UserRepository(client);
    // Userデータを1件insertする
    await createUserData(userRepository);
    const id = -1;
    const user = await userRepository.get(id);
    console.log(user);
    // 返却値がuser型でないことを確認
    expect(false).toBe(validUser(user));
  });
});

describe("userAPI getAllテスト", () => {
  it("getAll、正常系(1件突っ込み、1件取得)", async () => {
    //testデータ件数3
    const testNum = 3;
    const userRepository = new UserRepository(client);

    // Userデータを3件insertする
    const createdUsers = await createUserListData(testNum, userRepository);

    // user3件取得
    const userList = await userRepository.getAll();

    // 項目の検証
    expect(testNum).toBe(userList.length);

    const userMap = createUserMap(userList);
    createdUsers.forEach((createdUser) => {
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
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);

    // idはnumber型で固定（null回避）
    const resultId = await userRepository.create(testUser);

    // idでgetする
    const user = await userRepository.get(resultId);

    // 項目の検証
    expect(resultId).toBe(user.id);
    expect(testUser.name).toBe(user.name);
    expect(testUser.email).toBe(user.email);
    expect(testUser.pass).toBe(user.pass);
  });
});

describe("userAPI putテスト", () => {
  it("put、正常系(1件突っ込み、1件編集)", async () => {
    const id = 1;
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);

    // 書き換えたuser取得
    const resultUser = await userRepository.update(id, testUser);

    // 項目の検証
    expect(id).toBe(resultUser.id);
    expect(testUser.name).toBe(resultUser.name);
    expect(testUser.email).toBe(resultUser.email);
    expect(testUser.pass).toBe(resultUser.pass);
  });
});

describe("userAPI deleteテスト", () => {
  it("delete、正常系(1件突っ込み、1件削除)", async () => {
    //ユーザーAPIの作成
    const userRepository = new UserRepository(client);

    // Userデータを1件insertする
    const createdUser = await createUserData(userRepository);
    // idはnumber型で固定（null回避）
    const id = createdUser.id as number;
    const resultId = await userRepository.delete(id);

    // 削除されたデータのステータスのチェック
    expect(id).toBe(resultId);
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
