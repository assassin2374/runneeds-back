import { Client } from "pg";

// テストで使用するRepositoryです。
export class TestRepository {
  private client: Client;

  constructor(database: Client) {
    this.client = database;
  }

  async clearTable(tableName: string): Promise<void> {
    const query = {
      text: `
        DELETE FROM ${tableName}
      `,
    };
    await this.client.query(query);
  }
}
