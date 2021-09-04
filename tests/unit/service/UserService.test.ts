import { Client } from "pg";
import { User } from "../../../src/model/User";
import { UserService } from "../../../src/service/user/UserService";

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

describe("userAPI getテスト", () => {
  it("get、正常系(1件突っ込み、1件取得)", async () => {
    //ユーザーAPIの作成
    const userService = new UserService();

    // Userデータを1件作成する
    const createdUser = await createUserData(userRepository);
    const;
    // idはnumber型で固定（null回避）
    const id = createdUser.id as number;
    const response = await request(app).get(`/api/users/${id}`);

    //ステータスのチェック
    expect(HttpStatusCode.OK).toBe(response.statusCode);

    const user = response.body as User;
    // 項目の検証
    expect(createdUser.id).toBe(user.id);
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.pass).toBe(user.pass);
  });
});
