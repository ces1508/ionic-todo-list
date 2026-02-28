import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from '@repositories/category/category.repository';
import { Category } from '@models/category.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockRepository: {
    getAll: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const mockCategories: Category[] = [
    { id: 1, name: 'Work', color: '#ff0000', isActive: 1, createdAt: new Date() },
    { id: 2, name: 'Personal', color: '#00ff00', isActive: 1, createdAt: new Date() },
  ];

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn().mockResolvedValue({ data: mockCategories, total: 2 }),
      create: jest.fn().mockResolvedValue(mockCategories[0]),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryRepository, useValue: mockRepository },
      ],
    });

    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadCategories', () => {
    it('should load categories from repository', async () => {
      await service.loadCategories();
      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(service.categories()).toEqual(mockCategories);
    });

    it('should set loading state during load', async () => {
      const loadPromise = service.loadCategories();
      expect(service.loading()).toBe(true);
      await loadPromise;
      expect(service.loading()).toBe(false);
    });

    it('should handle error gracefully', async () => {
      mockRepository.getAll.mockRejectedValueOnce(new Error('DB Error'));
      await service.loadCategories();
      expect(service.loading()).toBe(false);
    });
  });

  describe('computed values', () => {
    it('should calculate category count', async () => {
      await service.loadCategories();
      expect(service.categoryCount()).toBe(2);
    });

    it('should indicate if categories exist', async () => {
      await service.loadCategories();
      expect(service.hasCategories()).toBe(true);
    });

    it('should return false for hasCategories when empty', async () => {
      mockRepository.getAll.mockResolvedValueOnce({ data: [], total: 0 });
      await service.loadCategories();
      expect(service.hasCategories()).toBe(false);
    });
  });

  describe('addCategory', () => {
    it('should add category and update state', async () => {
      await service.loadCategories();
      const newCategory = { name: 'New Category', color: '#0000ff' };
      await service.addCategory(newCategory);
      expect(mockRepository.create).toHaveBeenCalledWith(newCategory);
      expect(service.categories().length).toBe(3);
    });
  });

  describe('updateCategory', () => {
    it('should update category in state', async () => {
      await service.loadCategories();
      const updatedData = { name: 'Updated Name', color: '#ff00ff' };
      await service.updateCategory(1, updatedData);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updatedData);
    });
  });

  describe('deleteCategory', () => {
    it('should remove category from state', async () => {
      await service.loadCategories();
      await service.deleteCategory(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(service.categories().length).toBe(1);
    });
  });
});
