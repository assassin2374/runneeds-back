import { Rundata } from "../../model/Rundata";
import { Result } from "../../model/utils/Result";

// リポジトリ作成
export interface IRundataService {
  getAll(): Promise<Result<Rundata[]>>;
  get(id: number): Promise<Result<Rundata>>;
  create(rundata: Rundata): Promise<Result<number>>;
  update(id: number, rundata: Rundata): Promise<Result<Rundata>>;
  delete(id: number): Promise<Result<number>>;
}
