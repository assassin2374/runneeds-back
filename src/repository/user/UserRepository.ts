import { Client } from "pg";
import { User } from "../../model/User";
import { IUserRepository } from "./IUserRepository";

// リポジトリ作成
export class UserRepository implements IUserRepository {
  // clientを引数でもらう
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }
  // getAll作成
  async getAll(): Promise<User[]> {
    // SQLクエリ実行
    const query = {
      text: `
        SELECT 
          * 
        FROM
          users
      `,
    };
    const result = await this.client.query<User>(query);
    // User[]型に格納して返却
    const users = result.rows.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        pass: user.pass,
      } as User;
    });
    return users;
  }
  // get作成
  async get(id: number): Promise<User> {
    // SQLクエリ実行
    const query = {
      text: "SELECT * FROM users WHERE id=$1",
      values: [id],
    };
    const result = await this.client.query<User>(query);
    // User型に格納して返却
    let user: User = {
      id: 0,
      name: "",
      email: "",
      pass: "",
    };
    if (result.rowCount != 0) {
      user = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        pass: result.rows[0].pass,
      };
    }
    return user;
  }
  // create作成
  async create(user: User): Promise<number> {
    // SQLクエリ実行
    const query = {
      text: `
      INSERT INTO 
        users (name, email, pass) 
      VALUES 
        ($1, $2, $3)
      RETURNING id
      `,
      values: [user.name, user.email, user.pass],
    };
    const result = await this.client.query<{ id: number }>(query);
    return result.rows[0].id;
  }
  // update作成
  async update(id: number, user: User): Promise<User> {
    // SQLクエリ実行
    const query = {
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
      values: [user.name, user.email, user.pass, id],
    };
    await this.client.query<User>(query);
    // User型に格納（手動で格納、ホントはSELECTで返却値をもらう方が正しい）
    const updateUser = {
      id: id,
      name: user.name,
      email: user.email,
      pass: user.pass,
    };
    return updateUser;
  }
  // get作成
  async delete(id: number): Promise<number> {
    // SQLクエリ実行
    const query = {
      text: "DELETE FROM users where id=$1",
      values: [id],
    };
    await this.client.query<User>(query);

    return id;
  }
}
