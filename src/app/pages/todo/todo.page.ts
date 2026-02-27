import { Component, inject, signal } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { TodoService } from '../../services/todo.service';
import { TodoFilter, Todo, TodoFormData } from '../../models/todo.model';
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [IonicModule, TodoItemComponent, EmptyStateComponent],
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage {
  private readonly todoService = inject(TodoService);
  private readonly modalController = inject(ModalController);

  readonly todos = this.todoService.filteredTodos;
  readonly filter = this.todoService.filter;
  readonly completedCount = this.todoService.completedCount;

  editingTodo = signal<Todo | null>(null);

  constructor() {
    addIcons({ add });
  }

  onFilterChange(event: CustomEvent): void {
    this.todoService.setFilter(event.detail.value as TodoFilter);
  }

  onToggle(id: number): void {
    this.todoService.toggleTodo(id);
  }

  onDelete(id: number): void {
    this.todoService.deleteTodo(id);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }

  openEditModal(todo: Todo): void {
    // todo get information from service and pass it to the modal
    this.editingTodo.set(todo);
    this.openFormModal({
      mode: 'edit',
      todoData: {
        title: todo.title,
        description: todo.description || undefined,
      },
    });
  }

  openCreateModal(): void {
    this.openFormModal({ mode: 'create' });
  }

  private onFormSubmit(data: TodoFormData): void {
    if (this.editingTodo()) {
      this.todoService.updateTodo(this.editingTodo()!.id, data);
    } else {
      this.todoService.addTodo(data);
    }
    this.editingTodo.set(null);
  }

  private async openFormModal({
    mode,
    todoData,
  }: {
    mode: 'create' | 'edit';
    todoData?: TodoFormData;
  }): Promise<void> {
    const modal = await this.modalController.create({
      component: TodoFormComponent,
      componentProps: {
        mode,
        initialData: todoData || null,
      },
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<TodoFormData>();
    if (role === 'submit' && data) {
      this.onFormSubmit(data);
    }
  }
}
