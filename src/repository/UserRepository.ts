import express from "express";
import { Client } from "pg";
import { User } from "../model/User";

// getAll作成
export const UserRepository:QueryResult<User[]> (pgConnect:Client) => {
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
};