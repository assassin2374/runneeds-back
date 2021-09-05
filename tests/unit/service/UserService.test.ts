import { IUserRepository } from "../../../src/repository/user/IUserRepository";
import { User } from "../../../src/model/User";
import { UserService } from "../../../src/service/user/UserService";
import { HttpStatusCode } from "../../../src/model/utils/HttpStatusCode";

const mockUsers: User[] = [
  {
    id: 1,
    name: "name1",
    email: "email1",
    pass: "pass1",
  },
  {
    id: 2,
    name: "name2",
    email: "email2",
    pass: "pass2",
  },
  {
    id: 3,
    name: "name3",
    email: "email3",
    pass: "pass3",
  },
];

const mockUser: User = {
  id: 1,
  name: "name1",
  email: "email1",
  pass: "pass1",
};

const creatMockUsers = (id: number) => {
  const mockUser: User = {
    id: id,
    name: `name_${id}`,
    email: `email_${id}`,
    pass: `pass_${id}`,
  };
  return mockUser;
};

const mockErrRepository: IUserRepository = {
  getAll(): Promise<User[]> {
    return new Promise<User[]>(function (resolve, reject) {
      reject(mockUsers);
    });
  },
  get(id: number): Promise<User> {
    return new Promise<User>(function (resolve) {
      resolve(mockUser);
    });
  },
  create(user: User): Promise<number> {
    return new Promise<number>(function (resolve, reject) {
      resolve(0);
    });
  },
  update(id: number, user: User): Promise<User> {
    return new Promise<User>(function (resolve, reject) {
      resolve(mockUser);
    });
  },
  delete(id: number): Promise<number> {
    return new Promise<number>(function (resolve, reject) {
      resolve(0);
    });
  },
};

const mockRepository: IUserRepository = {
  getAll(): Promise<User[]> {
    return new Promise<User[]>(function () {
      console.warn("not implement");
    });
  },
  get(id: number): Promise<User> {
    return new Promise<User>(function () {
      console.warn("not implement");
    });
  },
  create(user: User): Promise<number> {
    return new Promise<number>(function () {
      console.warn("not implement");
    });
  },
  update(id: number, user: User): Promise<User> {
    return new Promise<User>(function () {
      console.warn("not implement");
    });
  },
  delete(id: number): Promise<number> {
    return new Promise<number>(function () {
      console.warn("not implement");
    });
  },
};

describe("userAPI getテスト", () => {
  it("get、正常系(1件突っ込み、1件取得)", async () => {
    const getfunc = (id: number): Promise<User> => {
      return new Promise<User>(function (resolve) {
        resolve(mockUser);
      });
    };
    mockRepository.get = getfunc;
    // idはnumber型で固定（null回避）
    const id = 0;
    const userService = new UserService(mockRepository);

    // user一件取得
    const result = await userService.get(id);

    //ステータスのチェック
    expect(HttpStatusCode.OK).toBe(result.statusCode);

    const resultUser = result.value as User;
    // 項目の検証
    expect(mockUser.id).toBe(resultUser.id);
    expect(mockUser.name).toBe(resultUser.name);
    expect(mockUser.email).toBe(resultUser.email);
    expect(mockUser.pass).toBe(resultUser.pass);
  });
  it("get、異常系(リクエストしたidが存在しない場合、ステータスコードを見る)", async () => {
    const getfunc = (id: number): Promise<User> => {
      return new Promise<User>(function (resolve) {
        const object = {};
        const user = object as User;
        resolve(user);
      });
    };
    mockRepository.get = getfunc;
    // idはnumber型で固定（null回避）
    const id = 0;
    const userService = new UserService(mockRepository);

    // user一件取得
    const result = await userService.get(id);

    //ステータスのチェック
    expect(HttpStatusCode.NotFound).toBe(result.statusCode);
    expect(result.value).toBeUndefined();
  });
});
