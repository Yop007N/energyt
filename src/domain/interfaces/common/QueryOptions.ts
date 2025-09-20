export interface QueryFilters {
  search?: string;
  pagination?: PaginationOptions;
  sort?: SortOptions;
  filters?: Record<string, unknown>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

export interface SortOptions {
  field: string;
  direction: SortDirection;
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FilterOption {
  key: string;
  value: unknown;
  operator: FilterOperator;
}

export enum FilterOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  CONTAINS = 'CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BETWEEN = 'BETWEEN'
}