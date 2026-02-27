import { Injectable, signal, computed, inject } from '@angular/core';
import { Todo, TodoFilter, TodoFormData } from '@models/todo.model';
import { TodoRepository } from '@repositories/todo/todo.repository';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly todoRepository = inject(TodoRepository);

  private readonly _todos = signal<Todo[]>([]);
  private readonly _filter = signal<TodoFilter>('all');
  private readonly _categoryFilter = signal<number | undefined>(undefined);
  private readonly _loading = signal(false);

  readonly todos = this._todos.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly categoryFilter = this._categoryFilter.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly filteredTodos = computed(() => {
    let todos = this._todos();
    const categoryId = this._categoryFilter();

    // Filter by category if set
    if (categoryId !== undefined) {
      todos = todos.filter((t) => t.categoryId === categoryId);
    }

    // Filter by status (active/completed)
    const currentFilter = this._filter();
    switch (currentFilter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  });

  readonly activeCount = computed(() =>
    this._todos().filter((t) => !t.completed).length
  );

  readonly completedCount = computed(() =>
    this._todos().filter((t) => t.completed).length
  );

  async loadTodos(): Promise<void> {
    this._loading.set(true);
    try {
      const result = await this.todoRepository.getAll(this._filter());
      this._todos.set(result.data);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      this._loading.set(false);
    }
  }

  setFilter(filter: TodoFilter): void {
    this._filter.set(filter);
  }

  setCategoryFilter(categoryId: number | undefined): void {
    this._categoryFilter.set(categoryId);
  }

  clearCategoryFilter(): void {
    this._categoryFilter.set(undefined);
  }

  async addTodo(data: TodoFormData): Promise<void> {
    try {
      const newTodo = await this.todoRepository.create(data);
      this._todos.update((todos) => [newTodo, ...todos]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  async updateTodo(id: number, data: TodoFormData): Promise<void> {
    try {
      await this.todoRepository.update(id, data);
      this._todos.update((todos) =>
        todos.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async toggleTodo(id: number): Promise<void> {
    try {
      await this.todoRepository.toggleComplete(id);
      this._todos.update((todos) =>
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await this.todoRepository.delete(id);
      this._todos.update((todos) => todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  async clearCompleted(): Promise<void> {
    try {
      await this.todoRepository.deleteCompleted();
      this._todos.update((todos) => todos.filter((t) => !t.completed));
    } catch (error) {
      console.error('Error clearing completed:', error);
    }
  }

  getTodoById(id: number): Todo | undefined {
    return this._todos().find((t) => t.id === id);
  }

  async loadTodosByCategory(categoryId: number): Promise<void> {
    this._loading.set(true);
    try {
      const result = await this.todoRepository.getByCategory(categoryId);
      this._todos.set(result);
    } catch (error) {
      console.error('Error loading todos by category:', error);
    } finally {
      this._loading.set(false);
    }
  }
}
