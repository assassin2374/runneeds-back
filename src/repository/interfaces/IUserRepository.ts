import { User } from "../../models/User";

export interface IUserRepository {
  getAll(): Promise<QueryResult<User[]>>;
}
