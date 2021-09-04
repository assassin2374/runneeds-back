import { Client } from "pg";
import { User } from "../../../src/model/User";
import { IUserRepository } from "../../../src/repository/user/IUserRepository";

// describe("userAPI getテスト", () => {
//   it("get、正常系(1件突っ込み、1件取得)", async () => {
//     //expressのアプリケーション実体化
//     const app: Application = express();
//     //ユーザーAPIの作成
//     const userRepository = new UserRepository(client);
//     const userService = new UserService(userRepository);
//     const userController = new UserController(userService);
//     //ユーザーAPIをエンドポイントに登録
//     app.use("/api/", userController.router);

//     // Userデータを1件insertする
//     const createdUser = await createUserData(userRepository);
//     // idはnumber型で固定（null回避）
//     const id = createdUser.id as number;
//     const response = await request(app).get(`/api/users/${id}`);

//     //ステータスのチェック
//     expect(HttpStatusCode.OK).toBe(response.statusCode);

//     const user = response.body as User;
//     // 項目の検証
//     expect(createdUser.id).toBe(user.id);
//     expect(createdUser.name).toBe(user.name);
//     expect(createdUser.email).toBe(user.email);
//     expect(createdUser.pass).toBe(user.pass);
//   });
// });
