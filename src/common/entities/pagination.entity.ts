export abstract class Pagination<T> {
  data: T[];
  totalRecords: number;
  pageCount: number;
  page: number;
  pageSize: number;
  orderBy: any[];
}
