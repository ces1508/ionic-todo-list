import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { CategoryService } from '@services/category/category.service';
import { Category, CategoryFormData } from '@models/category.model';
import { CategoryItemComponent } from '@components/category-item/category-item.component';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { CategoryFormComponent } from '@components/category-form/category-form.component';
import { PageHeaderComponent } from "@components/page-header/page-header.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [IonicModule, CategoryItemComponent, EmptyStateComponent, PageHeaderComponent],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  private readonly categoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController);

  readonly categories = this.categoryService.categories;

  editingCategory = signal<Category | null>(null);

  constructor() {
    addIcons({ add });
  }

  onDelete(id: number): void {
    this.categoryService.deleteCategory(id);
  }

  openEditModal(category: Category): void {
    this.editingCategory.set(category);
    this.openFormModal({
      mode: 'edit',
      categoryData: {
        name: category.name,
        color: category.color,
      },
    });
  }

  openCreateModal(): void {
    this.openFormModal({ mode: 'create' });
  }

  private onFormSubmit(data: CategoryFormData): void {
    if (this.editingCategory()) {
      this.categoryService.updateCategory(this.editingCategory()!.id, data);
    } else {
      this.categoryService.addCategory(data);
    }
    this.resetEditingCategory();
  }

  private async openFormModal({
    mode,
    categoryData,
  }: {
    mode: 'create' | 'edit';
    categoryData?: CategoryFormData;
  }): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoryFormComponent,
      componentProps: {
        mode,
        initialData: categoryData || null,
      },
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<CategoryFormData>();
    if (role === 'submit' && data) {
      this.onFormSubmit(data);
    }
    this.resetEditingCategory();
  }

  private resetEditingCategory(): void {
    this.editingCategory.set(null);
  }
}
