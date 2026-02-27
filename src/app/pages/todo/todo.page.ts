import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { TodoService } from '@services/todo/todo.service';
import { CategoryService } from '@services/category/category.service';
import { TodoFilter, Todo, TodoFormData } from '@models/todo.model';
import { TodoItemComponent } from '@components/todo-item/todo-item.component';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { TodoFormComponent } from '@components/todo-form/todo-form.component';
import { Router } from '@angular/router';
import { SearchBarComponent } from '@components/search-bar/search-bar.component';
import { TypeaheadItem } from '@models/type-head.model';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    IonicModule,
    TodoItemComponent,
    EmptyStateComponent,
    SearchBarComponent,
  ],
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPage implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly categoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController);
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);

  readonly todos = this.todoService.filteredTodos;
  readonly filter = this.todoService.filter;
  readonly completedCount = this.todoService.completedCount;
  readonly hasCategories = this.categoryService.hasCategories;
  readonly categories = this.categoryService.categories;
  categoryFilterId = this.todoService.categoryFilter;

  editingTodo = signal<Todo | null>(null);

  emptyDatComponent = computed(() => {
    if (this.hasCategories()) {
      return {
        title: 'No todos yet',
        message: 'Tap + to add your first todo',
      };
    }
    return {
      title: 'No Categories yet',
      message: 'first create a category',
    };
  });

  autoCompleteCategoryData = computed(() => {
    return this.categories().map((category) => ({
      text: category.name,
      value: category.id,
    }));
  });

  constructor() {
    addIcons({ add });
  }

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos() {
    this.todoService.loadTodos().then(() => console.log('loading todos'));
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
    this.editingTodo.set(todo);
    this.openFormModal({
      mode: 'edit',
      todoData: {
        title: todo.title,
        description: todo.description || undefined,
        categoryId: todo.categoryId,
      },
    });
  }

  goToCategories() {
    this.router.navigate(['/tabs/categories']);
  }

  async handleFilterByCategory(data: TypeaheadItem | undefined) {
    this.todoService.setCategoryFilter(data?.value);
    if (data?.value) {
      await this.todoService.loadTodosByCategory(data?.value);
    } else {
      await this.todoService.loadTodos();
    }
  }
  openCreateModal(): void {
    if (!this.hasCategories()) {
      this.showNoCategoriesAlert();
      return;
    }
    this.openFormModal({ mode: 'create' });
  }

  private async showNoCategoriesAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'No Categories',
      message: 'Please create at least one category before adding todos.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Create Category',
          handler: () => this.goToCategories(),
        },
      ],
    });
    await alert.present();
  }

  private onFormSubmit(data: TodoFormData): void {
    if (this.editingTodo()) {
      this.todoService.updateTodo(this.editingTodo()!.id, data);
    } else {
      this.todoService.addTodo(data);
    }
    this.resetEditingTodo();
  }

  private async openFormModal({
    mode,
    todoData,
  }: {
    mode: 'create' | 'edit';
    todoData?: TodoFormData;
  }): Promise<void> {
    const categories = this.autoCompleteCategoryData();
    const modal = await this.modalController.create({
      component: TodoFormComponent,
      componentProps: {
        mode,
        categories,
        initialData: todoData || null,
      },
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<TodoFormData>();
    if (role === 'submit' && data) {
      console.log({
        formData: data,
      });
      this.onFormSubmit(data);
    }
    this.resetEditingTodo();
  }

  private resetEditingTodo(): void {
    this.editingTodo.set(null);
  }
}
