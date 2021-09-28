import { IUserRepository } from "../../../src/repository/user/IUserRepository";
import { User } from "../../../src/model/User";
import { UserService } from "../../../src/service/user/UserService";
import { HttpStatusCode } from "../../../src/model/utils/HttpStatusCode";

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
    // test用のモック関数作成
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
    // test用のモック関数作成
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

describe("userAPI getAllテスト", () => {
  it("getAll、正常系(3件突っ込み、3件取得)", async () => {
    // テスト用引数
    const testNum = 3;
    // testNum分のデータ作成
    const MockUsers = creatMockUsers(testNum);
    // test用のモック関数作成
    const getfunc = (): Promise<User[]> => {
      return new Promise<User[]>(function (resolve) {
        resolve(MockUsers);
      });
    };
    mockRepository.getAll = getfunc;
    const userService = new UserService(mockRepository);

    // user一件取得
    const result = await userService.getAll();

    //ステータスのチェック
    expect(HttpStatusCode.OK).toBe(result.statusCode);

    const userList = result.value as User[];
    // 項目の検証
    expect(testNum).toBe(userList.length);

    const userMap = createUserMap(userList);
    MockUsers.forEach((createdUser) => {
      const id = createdUser.id as number;
      const user = userMap.get(id) as User;
      expect(createdUser.id).toBe(user.id);
      expect(createdUser.name).toBe(user.name);
      expect(createdUser.email).toBe(user.email);
      expect(createdUser.pass).toBe(user.pass);
    });
  });
  it("getAll、準正常系(0件取得、エラーなし)", async () => {
    // test用のモック関数作成
    const getfunc = (): Promise<User[]> => {
      return new Promise<User[]>(function (resolve) {
        resolve([]);
      });
    };
    mockRepository.getAll = getfunc;
    const userService = new UserService(mockRepository);

    // user一件取得
    const result = await userService.getAll();

    //ステータスのチェック
    expect(HttpStatusCode.OK).toBe(result.statusCode);

    const userList = result.value as User[];
    // 項目の検証
    expect(0).toBe(userList.length);
  });
});

describe("userAPI postテスト", () => {
  it("post、正常系(新しいユーザーデータ作成)", async () => {
    const id = mockUser.id as number;
    // test用のモック関数作成
    const postfunc = (): Promise<number> => {
      return new Promise<number>(function (resolve) {
        resolve(id);
      });
    };
    mockRepository.create = postfunc;
    const userService = new UserService(mockRepository);

    // create
    const result = await userService.create(mockUser);
    const resultId = result.value;

    //ステータスのチェック
    expect(HttpStatusCode.Created).toBe(result.statusCode);

    expect(id).toBe(resultId);
  });
});

describe("userAPI putテスト", () => {
  it("put、正常系(1件突っ込み、1件編集)", async () => {
    const id = mockUser.id as number;
    // test用のモック関数作成
    const getfunc = (id: number): Promise<User> => {
      return new Promise<User>(function (resolve) {
        resolve(mockUser);
      });
    };
    const putfunc = (id: number, user: User): Promise<User> => {
      return new Promise<User>(function (resolve) {
        resolve(mockUser);
      });
    };
    mockRepository.update = putfunc;
    mockRepository.get = getfunc;
    const userService = new UserService(mockRepository);

    // create
    const result = await userService.update(id, mockUser);

    //ステータスのチェック
    expect(HttpStatusCode.OK).toBe(result.statusCode);

    const resultUser = result.value as User;
    // 項目の検証
    expect(mockUser.id).toBe(resultUser.id);
    expect(mockUser.name).toBe(resultUser.name);
    expect(mockUser.email).toBe(resultUser.email);
    expect(mockUser.pass).toBe(resultUser.pass);
  });
  it("put、異常系(リクエストしたidがない場合、ステータスコードを見る)", async () => {
    const id = mockUser.id as number;
    // test用のモック関数作成
    const getfunc = (id: number): Promise<User> => {
      return new Promise<User>(function (resolve) {
        resolve(nullUser);
      });
    };
    const putfunc = (id: number, user: User): Promise<User> => {
      return new Promise<User>(function (resolve) {
        resolve(mockUser);
      });
    };
    mockRepository.update = putfunc;
    mockRepository.get = getfunc;
    const userService = new UserService(mockRepository);

    // create
    const result = await userService.update(id, mockUser);

    //ステータスのチェック
    expect(HttpStatusCode.NotFound).toBe(result.statusCode);
  });
});

describe("userAPI deleteテスト", () => {
  it("delete、正常系(1件削除)", async () => {
    const id = mockUser.id as number;
    // test用のモック関数作成
    const getfunc = (id: number): Promise<User> => {
      return new Promise<User>(function (resolve) {
        resolve(mockUser);
      });
    };
    const deletefunc = (id: number): Promise<number> => {
      return new Promise<number>(function (resolve) {
        resolve(id);
      });
    };
    mockRepository.delete = deletefunc;
    mockRepository.get = getfunc;
    const userService = new UserService(mockRepository);

    // create
    const result = await userService.delete(id);

    //ステータスのチェック
    expect(HttpStatusCode.NoContent).toBe(result.statusCode);

    const resultId = result.value as number;
    // 項目の検証
    expect(mockUser.id).toBe(resultId);
  });
  it("delete、異常系(リクエストしたidがない場合、ステータスコードを見る)", async () => {
    const id = mockUser.id as number;
    // test用のモック関数作成
    const getfunc = (id: number): Promise<User> => {
      return new Promise<User>(function (resolve) {
        resolve(nullUser);
      });
    };
    const deletefunc = (id: number): Promise<number> => {
      return new Promise<number>(function (resolve) {
        resolve(id);
      });
    };
    mockRepository.delete = deletefunc;
    mockRepository.get = getfunc;
    const userService = new UserService(mockRepository);

    // create
    const result = await userService.delete(id);

    //ステータスのチェック
    expect(HttpStatusCode.NotFound).toBe(result.statusCode);
  });
});

// 単一のUserデータ
const mockUser: User = {
  id: 1,
  name: "name1",
  email: "email1",
  pass: "pass1",
};

const nullUser: User = {
  id: 0,
  name: "",
  email: "",
  pass: "",
};

/**
 * 複数のUserデータを作成する
 * @returns 作成されたUserListデータ
 */
const creatMockUsers = (num: number) => {
  const mockUsers: User[] = [];
  for (let index = 0; index < num; index++) {
    const user: User = {
      id: index,
      name: `name_${index}`,
      email: `email_${index}`,
      pass: `pass_${index}`,
    };
    mockUsers.push(user);
  }
  return mockUsers;
};

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
