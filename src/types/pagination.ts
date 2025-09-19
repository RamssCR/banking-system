export interface Pagination<T> {
  data: T;
  page: number;
  total: number;
  lastPage: number;
}
