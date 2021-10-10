import { IActivityRepository } from "../../repository/activity/IActivityRepository";
import { Activity, validActivity } from "../../model/Activity";
import { Result } from "../../model/utils/Result";
import { HttpStatusCode } from "../../model/utils/HttpStatusCode";

// サービス作成
export class ActivityService {
  // IActivityRepositoryを引数でもらう
  private repository: IActivityRepository;
  constructor(repository: IActivityRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<Result<Activity[]>> {
    // 返却用のResultオブジェクト作成
    const result: Result<Activity[]> = {};
    // 値取得
    const activityList = await this.repository.getAll();
    console.log(activityList);
    // resultに結果を格納
    result.value = activityList;
    result.statusCode = HttpStatusCode.OK;

    return result;
  }

  async get(id: number): Promise<Result<Activity>> {
    // 返却用のResultオブジェクト作成
    const result: Result<Activity> = {};
    // 値取得
    const activity = await this.repository.get(id);
    console.log(activity);

    // resultに結果を格納
    if (validActivity(activity) == false) {
      result.statusCode = HttpStatusCode.NotFound;
      return result;
    }
    result.value = activity;
    result.statusCode = HttpStatusCode.OK;
    return result;
  }

  async create(activity: Activity): Promise<Result<number>> {
    // 返却用のResultオブジェクト作成
    const result: Result<number> = {};
    // 値取得
    const id = await this.repository.create(activity);
    console.log(id);
    // resultに結果を格納
    result.value = id;
    result.statusCode = HttpStatusCode.Created;
    return result;
  }

  async update(id: number, activity: Activity): Promise<Result<Activity>> {
    // 返却用のResultオブジェクト作成
    const result: Result<Activity> = {};
    // 値取得
    const fromActivity = await this.repository.get(id);
    if (validActivity(fromActivity) == false) {
      // resultに結果を格納
      result.statusCode = HttpStatusCode.NotFound;
      return result;
    }
    // 値取得
    const updateActivity = await this.repository.update(id, activity);
    console.log(updateActivity);
    // resultに結果を格納
    result.value = updateActivity;
    result.statusCode = HttpStatusCode.OK;
    return result;
  }

  async delete(id: number): Promise<Result<number>> {
    // 返却用のResultオブジェクト作成
    const result: Result<number> = {};
    const fromActivity = await this.repository.get(id);
    if (fromActivity.id == 0) {
      // resultに結果を格納
      result.statusCode = HttpStatusCode.NotFound;
      return result;
    }
    // resultに結果を格納
    result.value = await this.repository.delete(id);
    result.statusCode = HttpStatusCode.NoContent;
    return result;
  }
}
