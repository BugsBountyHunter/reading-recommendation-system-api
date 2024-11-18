export interface IResponse<T> {
  data?: T | null;
  errors?: string | string[] | object | null;
  message?: string | null;
  statusCode?: number | null;
}
