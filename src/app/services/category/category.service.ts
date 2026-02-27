import { Injectable, signal, computed, inject } from '@angular/core';
import { Category, CategoryFormData } from '@models/category.model';
import { CategoryRepository } from '@repositories/category/category.repository';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoryRepository = inject(CategoryRepository);

  private readonly _categories = signal<Category[]>([]);
  private readonly _loading = signal(false);

  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly categoryCount = computed(() => this._categories().length);
  readonly hasCategories = computed(() => this._categories().length > 0);

  async loadCategories(): Promise<void> {
    this._loading.set(true);
    try {
      const result = await this.categoryRepository.getAll();
      this._categories.set(result.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async addCategory(data: CategoryFormData): Promise<void> {
    try {
      const newCategory = await this.categoryRepository.create(data);
      this._categories.update((categories) => [newCategory, ...categories]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  }

  async updateCategory(id: number, data: CategoryFormData): Promise<void> {
    try {
      await this.categoryRepository.update(id, data);
      this._categories.update((categories) =>
        categories.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
    } catch (error) {
      console.error('Error updating category:', error);
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await this.categoryRepository.delete(id);
      this._categories.update((categories) =>
        categories.filter((c) => c.id !== id)
      );
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
}
