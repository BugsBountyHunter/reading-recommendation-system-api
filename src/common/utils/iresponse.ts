export interface IPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
export interface IResponse<T> {
  data?: T | null;
  errors?: string | string[] | object | null;
  message?: string | null;
  statusCode?: number | null;
  meta?: IPaginationMeta | null;
}
