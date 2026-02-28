import { Injectable, signal, computed, inject } from '@angular/core';
import {
  Todo,
  TodoFilter,
  TodoFormData,
  TodoPaginationState,
} from '@models/todo.model';
import { TodoRepository } from '@repositories/todo/todo.repository';

const PAGE_SIZE = 20;

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todoRepository = inject(TodoRepository);

  private readonly _todos = signal<Todo[]>([]);
  private readonly _filter = signal<TodoFilter>('all');
  private readonly _categoryFilter = signal<number | undefined>(undefined);
  private readonly _loading = signal(false);
  private readonly _loadingMore = signal(false);
  private readonly _currentPage = signal(1);
  private readonly _hasMorePages = signal(true);
  private readonly _totalItems = signal(0);

  readonly todos = this._todos.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly categoryFilter = this._categoryFilter.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loadingMore = this._loadingMore.asReadonly();
  readonly hasMorePages = this._hasMorePages.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalItems = this._totalItems.asReadonly();

  readonly filteredTodos = computed(() => {
    const todos = this._todos();
    const categoryId = this._categoryFilter();
    const currentFilter = this._filter();

    let filtered = todos;

    if (categoryId !== undefined) {
      filtered = filtered.filter((t) => t.categoryId === categoryId);
    }

    switch (currentFilter) {
      case 'active':
        return filtered.filter((t) => !t.completed);
      case 'completed':
        return filtered.filter((t) => t.completed);
      default:
        return filtered;
    }
  });

  readonly activeCount = computed(
    () => this._todos().filter((t) => !t.completed).length,
  );

  readonly completedCount = computed(
    () => this._todos().filter((t) => t.completed).length,
  );

  async loadTodos(page: number = 1): Promise<void> {
    if (page === 1) {
      this._loading.set(true);
      this._currentPage.set(1);
      this._hasMorePages.set(true);
    } else {
      this._loadingMore.set(true);
    }

    try {
      const categoryId = this._categoryFilter();
      const currentFilter = this._filter();

      const result = await this.todoRepository.getAll(
        currentFilter,
        categoryId,
        { page, pageSize: PAGE_SIZE },
      );

      if (page === 1) {
        this._todos.set(result.data);
      } else {
        this._todos.update((existing) => [...existing, ...result.data]);
      }

      this._currentPage.set(result.pagination.page);
      this._totalItems.set(result.pagination.totalItems);

      const loadedItems =
        page === 1 ? result.data.length : this._todos().length;

      this._hasMorePages.set(loadedItems < result.pagination.totalItems);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      this._loading.set(false);
      this._loadingMore.set(false);
    }
  }

  async loadMoreTodos(): Promise<void> {
    if (this._loadingMore() || !this._hasMorePages()) {
      return;
    }

    const nextPage = this._currentPage() + 1;
    await this.loadTodos(nextPage);
  }

  async refresh(): Promise<void> {
    this._currentPage.set(1);
    this._hasMorePages.set(true);
    await this.loadTodos(1);
  }

  setFilter(filter: TodoFilter): void {
    console.log('todo filter');
    if (this._filter() !== filter) {
      this._filter.set(filter);
      this.refresh();
    }
  }

  setCategoryFilter(categoryId: number | undefined): void {
    if (this._categoryFilter() !== categoryId) {
      this._categoryFilter.set(categoryId);
      this.refresh();
    }
  }

  clearCategoryFilter(): void {
    this.setCategoryFilter(undefined);
  }

  async addTodo(data: TodoFormData): Promise<void> {
    try {
      const newTodo = await this.todoRepository.create(data);
      this._todos.update((todos) => [newTodo, ...todos]);
      this._totalItems.update((count) => count + 1);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  async updateTodo(id: number, data: TodoFormData): Promise<void> {
    try {
      await this.todoRepository.update(id, data);
      this._todos.update((todos) =>
        todos.map((t) => (t.id === id ? { ...t, ...data } : t)),
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async toggleTodo(id: number): Promise<void> {
    try {
      await this.todoRepository.toggleComplete(id);
      this._todos.update((todos) =>
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await this.todoRepository.delete(id);
      this._todos.update((todos) => todos.filter((t) => t.id !== id));
      this._totalItems.update((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  async clearCompleted(): Promise<void> {
    try {
      await this.todoRepository.deleteCompleted();
      this._todos.update((todos) => todos.filter((t) => !t.completed));
      await this.refresh();
    } catch (error) {
      console.error('Error clearing completed:', error);
    }
  }

  getTodoById(id: number): Todo | undefined {
    return this._todos().find((t) => t.id === id);
  }
}
