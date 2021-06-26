import { Client } from "pg";

export class Database {
  // Connectionを定義する
  constructor() {
    // データベース設定
    const client = new Client({
      host: "localhost",
      database: "runneeds",
      user: "root",
      password: "root",
      port: 5432,
    });
    // データベース接続
    client.connect();
  }
}
