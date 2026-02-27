export interface PaginationParams {
  page: number;
  pageSize?: number;
}

export interface PaginationResult {
  skip: number;
  limit: number;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export function calculatePagination(
  page: number = 1,
  pageSize: number = 20
): PaginationResult {
  const validPage = Math.max(1, Math.floor(page));
  const validPageSize = Math.max(1, Math.floor(pageSize || 20));

  return {
    skip: (validPage - 1) * validPageSize,
    limit: validPageSize,
    page: validPage,
    pageSize: validPageSize,
  };
}

export function calculateTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0) return 0;
  return Math.ceil(totalItems / pageSize);
}

export function buildPaginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  totalItems: number
): PaginatedResult<T> {
  return {
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: calculateTotalPages(totalItems, pageSize),
    },
  };
}
