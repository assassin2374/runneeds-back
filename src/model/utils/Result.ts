export type Result<T extends any = null> = {
  value: T;
  statusCode: number;
};
