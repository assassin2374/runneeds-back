import { IRundataRepository } from "../../repository/rundata/IRundataRepository";
import { Rundata, validRundata } from "../../model/Rundata";
import { Result } from "../../model/utils/Result";
import { HttpStatusCode } from "../../model/utils/HttpStatusCode";

// サービス作成
export class RundataService {
  // IRundataRepositoryを引数でもらう
  private repository: IRundataRepository;
  constructor(repository: IRundataRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<Result<Rundata[]>> {
    // 返却用のResultオブジェクト作成
    const result: Result<Rundata[]> = {};
    // 値取得
    const rundataList = await this.repository.getAll();
    console.log(rundataList);
    // resultに結果を格納
    result.value = rundataList;
    result.statusCode = HttpStatusCode.OK;

    return result;
  }

  async get(id: number): Promise<Result<Rundata>> {
    // 返却用のResultオブジェクト作成
    const result: Result<Rundata> = {};
    // 値取得
    const rundata = await this.repository.get(id);
    console.log(rundata);

    // resultに結果を格納
    if (validRundata(rundata) == false) {
      result.statusCode = HttpStatusCode.NotFound;
      return result;
    }
    result.value = rundata;
    result.statusCode = HttpStatusCode.OK;
    return result;
  }

  async create(rundata: Rundata): Promise<Result<number>> {
    // 返却用のResultオブジェクト作成
    const result: Result<number> = {};
    // 値取得
    const id = await this.repository.create(rundata);
    console.log(id);
    // resultに結果を格納
    result.value = id;
    result.statusCode = HttpStatusCode.Created;
    return result;
  }

  async update(id: number, rundata: Rundata): Promise<Result<Rundata>> {
    // 返却用のResultオブジェクト作成
    const result: Result<Rundata> = {};
    // 値取得
    const fromRundata = await this.repository.get(id);
    if (validRundata(fromRundata) == false) {
      // resultに結果を格納
      result.statusCode = HttpStatusCode.NotFound;
      return result;
    }
    // 値取得
    const updateRundata = await this.repository.update(id, rundata);
    console.log(updateRundata);
    // resultに結果を格納
    result.value = updateRundata;
    result.statusCode = HttpStatusCode.OK;
    return result;
  }

  async delete(id: number): Promise<Result<number>> {
    // 返却用のResultオブジェクト作成
    const result: Result<number> = {};
    const fromRundata = await this.repository.get(id);
    if (fromRundata.id == 0) {
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
