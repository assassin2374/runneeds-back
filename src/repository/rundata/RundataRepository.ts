import { Client } from "pg";
import { Rundata, RundataTable } from "../../model/Rundata";
import { IRundataRepository } from "./IRundataRepository";

// リポジトリ作成
export class RundataRepository implements IRundataRepository {
  // clientを引数でもらう
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }
  // getAll作成
  async getAll(): Promise<Rundata[]> {
    // SQLクエリ実行
    const query = {
      text: `
        SELECT 
          * 
        FROM
          rundatas
        ORDER BY id DESC
      `,
    };
    const result = await this.client.query<RundataTable>(query);
    // Rundata[]型に格納して返却
    const rundatas = result.rows.map((rundata) => {
      return {
        id: rundata.id,
        time: rundata.time,
        distance: rundata.distance,
        userId: rundata.user_id,
      } as Rundata;
    });
    return rundatas;
  }
  // get作成
  async get(id: number): Promise<Rundata> {
    // SQLクエリ実行
    const query = {
      text: "SELECT * FROM rundatas WHERE id=$1",
      values: [id],
    };
    const result = await this.client.query<RundataTable>(query);
    // Rundata型に格納して返却
    let rundata: Rundata = {
      id: 0,
      time: null,
      distance: "",
      userId: "",
    };
    if (result.rowCount != 0) {
      rundata = {
        id: result.rows[0].id,
        time: result.rows[0].time,
        distance: result.rows[0].distance,
        userId: result.rows[0].user_id,
      };
    }
    return rundata;
  }
  // create作成
  async create(rundata: Rundata): Promise<number> {
    // SQLクエリ実行
    const query = {
      text: `
      INSERT INTO 
        rundatas (time, distance, userId) 
      VALUES 
        ($1, $2, $3)
      RETURNING id
      `,
      values: [rundata.time, rundata.distance, rundata.userId],
    };
    const result = await this.client.query<{ id: number }>(query);
    return result.rows[0].id;
  }
  // update作成
  async update(id: number, rundata: Rundata): Promise<Rundata> {
    // SQLクエリ実行
    const query = {
      text: `
      UPDATE
        rundatas
      SET
        time = $1,
        distance = $2,
        userId = $3
      WHERE
        id = $4;
      `,
      values: [rundata.time, rundata.distance, rundata.userId, id],
    };
    await this.client.query<RundataTable>(query);
    // User型に格納（手動で格納、ホントはSELECTで返却値をもらう方が正しい）
    const updateRundata = {
      id: id,
      time: rundata.time,
      distance: rundata.distance,
      userId: rundata.userId,
    };
    return updateRundata;
  }
  // get作成
  async delete(id: number): Promise<number> {
    // SQLクエリ実行
    const query = {
      text: "DELETE FROM rundatas where id=$1",
      values: [id],
    };
    await this.client.query<RundataTable>(query);

    return id;
  }
}
