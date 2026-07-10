export interface PageResponse<T> {
  items: T[] | null;
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  total: number
}

