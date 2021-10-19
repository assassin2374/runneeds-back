import { Client } from "pg";
import { Activity, ActivityTable } from "../../model/Activity";
import { IActivityRepository } from "./IActivityRepository";

// リポジトリ作成
export class ActivityRepository implements IActivityRepository {
  // clientを引数でもらう
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }
  // getAll作成
  async getAll(): Promise<Activity[]> {
    // SQLクエリ実行
    const query = {
      text: `
        SELECT 
          * 
        FROM
          activities
        ORDER BY id DESC
      `,
    };
    const result = await this.client.query<ActivityTable>(query);
    // activity[]型に格納して返却
    const activitys = result.rows.map((activity) => {
      return {
        id: activity.id,
        startTime: activity.start_time,
        goalTime: activity.goal_time,
        distance: activity.distance,
        userId: activity.user_id,
      } as Activity;
    });
    return activitys;
  }
  // get作成
  async get(id: number): Promise<Activity> {
    // SQLクエリ実行
    const query = {
      text: "SELECT * FROM activities WHERE id=$1",
      values: [id],
    };
    const result = await this.client.query<ActivityTable>(query);
    // activity型に格納して返却
    let activity: Activity = {
      id: 0,
      startTime: null,
      goalTime: null,
      distance: 0,
      userId: "",
    };
    if (result.rowCount != 0) {
      activity = {
        id: result.rows[0].id,
        startTime: result.rows[0].start_time,
        goalTime: result.rows[0].goal_time,
        distance: result.rows[0].distance,
        userId: result.rows[0].user_id,
      };
    }
    return activity;
  }
  // create作成
  async create(activity: Activity): Promise<number> {
    // SQLクエリ実行
    const query = {
      text: `
      INSERT INTO 
        activities (start_time, goal_time, distance, user_id) 
      VALUES 
        ($1, $2, $3, $4)
      RETURNING id
      `,
      values: [
        activity.startTime,
        activity.goalTime,
        activity.distance,
        activity.userId,
      ],
    };
    const result = await this.client.query<{ id: number }>(query);
    return result.rows[0].id;
  }
  // update作成
  async update(id: number, activity: Activity): Promise<Activity> {
    // SQLクエリ実行
    const query = {
      text: `
      UPDATE
        activities
      SET
        start_time = $1,
        goal_time = $2,
        distance = $3,
        user_id = $4
      WHERE
        id = $5;
      `,
      values: [
        activity.startTime,
        activity.goalTime,
        activity.distance,
        activity.userId,
        id,
      ],
    };
    await this.client.query<ActivityTable>(query);
    // Activity型に格納（手動で格納、ホントはSELECTで返却値をもらう方が正しい）
    const updateactivity = {
      id: id,
      startTime: activity.startTime,
      goalTime: activity.goalTime,
      distance: activity.distance,
      userId: activity.userId,
    };
    return updateactivity;
  }
  // get作成
  async delete(id: number): Promise<number> {
    // SQLクエリ実行
    const query = {
      text: "DELETE FROM activities where id=$1",
      values: [id],
    };
    await this.client.query<ActivityTable>(query);

    return id;
  }
}
