import { Injectable, signal, computed } from '@angular/core';
import { Todo, TodoFilter, TodoFormData } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly _todos = signal<Todo[]>([]);
  private readonly _filter = signal<TodoFilter>('all');

  readonly todos = this._todos.asReadonly();
  readonly filter = this._filter.asReadonly();

  readonly filteredTodos = computed(() => {
    const todos = this._todos();
    const currentFilter = this._filter();
    
    switch (currentFilter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  });

  readonly activeCount = computed(() => 
    this._todos().filter(t => !t.completed).length
  );

  readonly completedCount = computed(() => 
    this._todos().filter(t => t.completed).length
  );

  setFilter(filter: TodoFilter): void {
    this._filter.set(filter);
  }

  addTodo(data: TodoFormData): void {
    const newTodo: Todo = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      completed: false,
      createdAt: new Date()
    };
    this._todos.update(todos => [...todos, newTodo]);
  }

  updateTodo(id: number, data: TodoFormData): void {
    this._todos.update(todos =>
      todos.map(todo => 
        todo.id === id 
          ? { ...todo, title: data.title, description: data.description } 
          : todo
      )
    );
  }

  toggleTodo(id: number): void {
    this._todos.update(todos =>
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  deleteTodo(id: number): void {
    this._todos.update(todos => todos.filter(todo => todo.id !== id));
  }

  clearCompleted(): void {
    this._todos.update(todos => todos.filter(todo => !todo.completed));
  }

  getTodoById(id: number): Todo | undefined {
    return this._todos().find(todo => todo.id === id);
  }
}
