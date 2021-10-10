import { Activity } from "../../model/Activity";

// リポジトリ作成
export interface IActivityRepository {
  getAll(): Promise<Activity[]>;
  get(id: number): Promise<Activity>;
  create(activity: Activity): Promise<number>;
  update(id: number, activity: Activity): Promise<Activity>;
  delete(id: number): Promise<number>;
}
