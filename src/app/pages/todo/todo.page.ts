import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonButton,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';
import { TodoService } from '@services/todo/todo.service';
import { CategoryService } from '@services/category/category.service';
import { TodoFilter, Todo, TodoFormData } from '@models/todo.model';
import { TodoItemComponent } from '@components/todo-item/todo-item.component';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { TodoFormComponent } from '@components/todo-form/todo-form.component';
import { Router } from '@angular/router';
import { SearchBarComponent } from '@components/search-bar/search-bar.component';
import { ShareButtonComponent } from '@components/share-button/share-button.component';
import { TypeaheadItem } from '@models/type-head.model';
import { RemoteConfigService } from '@services/remote-config/remote-config.service';
import { REMOTE_CONFIG_DOWNLOAD_REPORT_KEY } from '@core/remote-config.constants';
import { APP_TEXTS_TOKEN } from '@core/app-texts';
import { from } from 'rxjs';
import { PageHeaderComponent } from '@components/page-header/page-header.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
    TodoItemComponent,
    EmptyStateComponent,
    SearchBarComponent,
    ShareButtonComponent,
    PageHeaderComponent,
  ],
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPage implements OnInit, OnDestroy {
  private readonly todoService = inject(TodoService);
  private readonly categoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController);
  private readonly alertController = inject(AlertController);
  private readonly remoteConfigService = inject(RemoteConfigService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly texts = inject(APP_TEXTS_TOKEN);

  readonly todos = this.todoService.filteredTodos;
  readonly filter = this.todoService.filter;
  readonly completedCount = this.todoService.completedCount;
  readonly hasCategories = this.categoryService.hasCategories;
  readonly categories = this.categoryService.categories;
  readonly loading = this.todoService.loading;
  readonly categoryFilterId = this.todoService.categoryFilter;
  readonly hasMorePages = this.todoService.hasMorePages;
  readonly loadingMore = this.todoService.loadingMore;

  editingTodo = signal<Todo | null>(null);
  canShare = signal<boolean>(true);

  emptyDatComponent = computed(() => {
    if (this.hasCategories()) {
      return {
        title: this.texts.empty.noTodos,
        message: this.texts.empty.tapToAddFirstTodo,
      };
    }
    return {
      title: this.texts.empty.noCategories,
      message: this.texts.empty.tapToAddFirstCategory,
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
    this.checkRemoteConfig();
    this.getTodos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTodos() {
    this.todoService.loadTodos();
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

  handleFilterByCategory(data: TypeaheadItem | undefined): void {
    this.todoService.setCategoryFilter(data?.value);
  }

  async onLoadMore(event: CustomEvent): Promise<void> {
    const infiniteScroll = event.target as HTMLIonInfiniteScrollElement;
    await this.todoService.loadMoreTodos();
    await infiniteScroll.complete();
  }

  async onScrollEnd(): Promise<void> {
    if (this.hasMorePages() && !this.loadingMore()) {
      await this.todoService.loadMoreTodos();
    }
  }

  async onRefresh(event: any): Promise<void> {
    await this.todoService.refresh();
    await event.target.complete();
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
      header: this.texts.alerts.noCategories,
      message: this.texts.alerts.createCategoryFirst,
      buttons: [
        {
          text: this.texts.buttons.cancel,
          role: 'cancel',
        },
        {
          text: this.texts.alerts.createCategory,
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
      this.onFormSubmit(data);
    }
    this.resetEditingTodo();
  }

  private resetEditingTodo(): void {
    this.editingTodo.set(null);
  }

  checkRemoteConfig() {
    from(this.remoteConfigService.load())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const remoteValue = this.remoteConfigService.getBoolean(
            REMOTE_CONFIG_DOWNLOAD_REPORT_KEY,
          );
          if (remoteValue !== this.canShare()) {
            this.canShare.set(remoteValue);
          }
        },
        error: () => {
          // Silent fail for remote config
        },
      });
  }
}

