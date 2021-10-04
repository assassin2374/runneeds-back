import { Router } from "express";
import { IRundataService } from "../../service/rundata/IRundataService";
import { Rundata, validRundata } from "../../model/Rundata";
import { HttpStatusCode } from "../../model/utils/HttpStatusCode";

// サービス作成
export class RundataController {
  public router: Router;
  // IUserRepositoryを引数でもらう
  private service: IRundataService;
  constructor(service: IRundataService) {
    this.router = Router();
    this.service = service;

    // getAll作成
    this.router.get("/rundata", async (req, res) => {
      // リポジトリにpgConnectを渡す
      const result = await service.getAll();
      const statusCode = result.statusCode as number;
      const rundataList = result.value as Rundata[];
      console.log(rundataList);
      res.status(statusCode).json(rundataList);
    });

    // get作成
    this.router.get("/rundata/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const result = await service.get(id);
      const statusCode = result.statusCode as number;
      const rundata = result.value;

      console.log(rundata);
      if (statusCode == HttpStatusCode.NotFound) {
        res.status(statusCode).json("not found");
        return;
      }
      res.status(statusCode).json(rundata);
    });

    // post作成
    this.router.post("/rundata/", async (req, res) => {
      const reqRundata = req.body as Rundata;
      if (validRundata(reqRundata) == false) {
        res.status(HttpStatusCode.BadRequest).json("中身がないです");
        return;
      }
      delete reqRundata.id;
      // SQLクエリ実行
      const result = await service.create(reqRundata);
      const statusCode = result.statusCode as number;
      const id = result.value as number;

      console.log(id);
      res.status(statusCode).json(id);
    });

    // put作成
    this.router.put("/rundata/:id", async (req, res) => {
      // id取得
      const id = parseInt(req.params.id);
      const reqRundata = req.body as Rundata;
      if (validRundata(reqRundata) == false) {
        res.status(HttpStatusCode.BadRequest).json("中身がないです");
        return;
      }
      delete reqRundata.id;

      // SQLクエリ実行
      const result = await service.update(id, reqRundata);
      const statusCode = result.statusCode as number;
      const rundata = result.value;

      console.log(rundata);
      if (statusCode == HttpStatusCode.NotFound) {
        res.status(statusCode).json("id not found");
        return;
      }
      res.status(statusCode).json(rundata);
    });

    // delete作成
    this.router.delete("/rundata/:id", async (req, res) => {
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
