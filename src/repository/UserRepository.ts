import express from "express";
import { Client } from "pg";
import { User } from "../model/User";

// getAll作成
export class UserRepository {
  // getAll作成
  getAll(): Promise<User> {
    // SQLクエリ実行
    const query = {
      text: `
        SELECT 
          * 
        FROM
          users
      `,
    };

    return pgConnect.query<User>(query);
  }
}
