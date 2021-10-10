import { Router } from "express";
import { IActivityService } from "../../service/activity/IActivityService";
import { Activity, validActivity } from "../../model/Activity";
import { HttpStatusCode } from "../../model/utils/HttpStatusCode";

// サービス作成
export class ActivityController {
  public router: Router;
  // IUserRepositoryを引数でもらう
  private service: IActivityService;
  constructor(service: IActivityService) {
    this.router = Router();
    this.service = service;

    // getAll作成
    this.router.get("/activity", async (req, res) => {
      // リポジトリにpgConnectを渡す
      const result = await service.getAll();
      const statusCode = result.statusCode as number;
      const activityList = result.value as Activity[];
      console.log(activityList);
      res.status(statusCode).json(activityList);
    });

    // get作成
    this.router.get("/activity/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const result = await service.get(id);
      const statusCode = result.statusCode as number;
      const activity = result.value;

      console.log(activity);
      if (statusCode == HttpStatusCode.NotFound) {
        res.status(statusCode).json("not found");
        return;
      }
      res.status(statusCode).json(activity);
    });

    // post作成
    this.router.post("/activity/", async (req, res) => {
      const reqActivity = req.body as Activity;
      if (validActivity(reqActivity) == false) {
        res.status(HttpStatusCode.BadRequest).json("中身がないです");
        return;
      }
      delete reqActivity.id;
      // SQLクエリ実行
      const result = await service.create(reqActivity);
      const statusCode = result.statusCode as number;
      const id = result.value as number;

      console.log(id);
      res.status(statusCode).json(id);
    });

    // put作成
    this.router.put("/activity/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const reqActivity = req.body as Activity;
      if (validActivity(reqActivity) == false) {
        res.status(HttpStatusCode.BadRequest).json("中身がないです");
        return;
      }
      delete reqActivity.id;

      // SQLクエリ実行
      const result = await service.update(id, reqActivity);
      const statusCode = result.statusCode as number;
      const activity = result.value;

      console.log(activity);
      if (statusCode == HttpStatusCode.NotFound) {
        res.status(statusCode).json("id not found");
        return;
      }
      res.status(statusCode).json(activity);
    });

    // delete作成
    this.router.delete("/activity/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);

      // SQLクエリ実行
      const result = await service.delete(id);
      const statusCode = result.statusCode as number;
      const lostId = result.value as number;

      console.log(lostId);
      if (statusCode == HttpStatusCode.NotFound) {
        res.status(statusCode).json("id not found");
        return;
      }
      res.status(statusCode).json();
    });
  }
}
