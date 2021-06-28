import { Client } from "pg";
import { User } from "../model/User";

// getAll作成
export class UserRepository {
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
  // getAll作成
  async get(id: number): Promise<User> {
    // SQLクエリ実行
    const query = {
      text: "SELECT * FROM users WHERE id=$1",
      values: [id],
    };
    const result = await this.client.query<User>(query);
    // User型に格納して返却
    const user = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      pass: result.rows[0].pass,
    };
    return user;
  }
}
