export interface CustomHttpInterface<T = any> {
  statusCode: number;
  message: string;
  status: string;
  data: T;
}

export interface CustomPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
}

export interface CustomPaginationData<T> {
  items: T;
  pagination: CustomPagination;
}

export interface CustomHttpInterfacePaginate<T>
  extends CustomHttpInterface<CustomPaginationData<T>> {}
