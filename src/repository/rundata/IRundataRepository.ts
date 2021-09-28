import { Rundata } from "../../model/Rundata";

// リポジトリ作成
export interface IRundataRepository {
  getAll(): Promise<Rundata[]>;
  get(id: number): Promise<Rundata>;
  create(rundata: Rundata): Promise<number>;
  update(id: number, rundata: Rundata): Promise<Rundata>;
  delete(id: number): Promise<number>;
}
