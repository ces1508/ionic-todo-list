export interface TodoBase {
  title: string;
  description?: string;
  categoryId?: number;
}

export interface Todo extends TodoBase {
  id: number;
  completed: boolean;
  createdAt: Date;
  categoryName?: string;
  categoryColor?: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoFormData {
  title: string;
  description?: string;
  categoryId?: number;
}

export interface TodoPaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  hasMore: boolean;
}
