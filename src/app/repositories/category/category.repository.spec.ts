import { TestBed } from '@angular/core/testing';
import { CategoryRepository } from './category.repository';
import { SqliteAdapterService } from '@adapters/sqlite.adapter';
import { CategoryFormData } from '@models/category.model';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;
  let mockDb: {
    execute: jest.Mock;
    query: jest.Mock;
  };

  beforeEach(() => {
    mockDb = {
      execute: jest.fn().mockResolvedValue({ insertId: 1, rowsAffected: 1 }),
      query: jest.fn().mockResolvedValue([]),
    };

    TestBed.configureTestingModule({
      providers: [
        CategoryRepository,
        { provide: SqliteAdapterService, useValue: mockDb },
      ],
    });

    repository = TestBed.inject(CategoryRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return paginated categories', async () => {
      mockDb.query
        .mockResolvedValueOnce([{ total: 1 }])
        .mockResolvedValueOnce([{
          id: 1,
          name: 'Work',
          color: '#ff0000',
          isActive: 1,
          createdAt: '2024-01-01',
        }]);

      const result = await repository.getAll();

      expect(result.data.length).toBe(1);
      expect(result.pagination.totalItems).toBe(1);
    });

    it('should filter inactive when includeInactive is false', async () => {
      mockDb.query
        .mockResolvedValueOnce([{ total: 0 }])
        .mockResolvedValueOnce([]);

      await repository.getAll(undefined, false);

      const call = mockDb.query.mock.calls[1];
      expect(call[0]).toContain('WHERE isActive = 1');
    });
  });

  describe('getById', () => {
    it('should return category by id', async () => {
      mockDb.query.mockResolvedValue([{
        id: 1,
        name: 'Work',
        color: '#ff0000',
        isActive: 1,
        createdAt: '2024-01-01',
      }]);

      const result = await repository.getById(1);

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Work');
    });

    it('should return null if not found', async () => {
      mockDb.query.mockResolvedValue([]);

      const result = await repository.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert a new category', async () => {
      const data: CategoryFormData = {
        name: 'New Category',
        color: '#0000ff',
      };

      const result = await repository.create(data);

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('INSERT INTO categories');
      expect(call[1]).toContain('New Category');
      expect(result.name).toBe('New Category');
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      await repository.update(1, { name: 'Updated', color: '#fff' });

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('UPDATE categories');
    });
  });

  describe('delete', () => {
    it('should soft delete a category', async () => {
      await repository.delete(1);

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('UPDATE categories SET isActive = 0');
    });
  });

  describe('restore', () => {
    it('should restore a category', async () => {
      await repository.restore(1);

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('UPDATE categories SET isActive = 1');
    });
  });

  describe('permanentlyDelete', () => {
    it('should permanently delete a category', async () => {
      await repository.permanentlyDelete(1);

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('DELETE FROM categories');
    });
  });
});
