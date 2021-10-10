import { Activity } from "../../model/Activity";
import { Result } from "../../model/utils/Result";

// リポジトリ作成
export interface IActivityService {
  getAll(): Promise<Result<Activity[]>>;
  get(id: number): Promise<Result<Activity>>;
  create(Activity: Activity): Promise<Result<number>>;
  update(id: number, Activity: Activity): Promise<Result<Activity>>;
  delete(id: number): Promise<Result<number>>;
}
