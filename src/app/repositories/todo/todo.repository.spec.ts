import { TestBed } from '@angular/core/testing';
import { TodoRepository } from './todo.repository';
import { SqliteAdapterService } from '@adapters/sqlite.adapter';
import { TodoFormData } from '@models/todo.model';

describe('TodoRepository', () => {
  let repository: TodoRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      execute: jest.fn().mockResolvedValue({ insertId: 1, rowsAffected: 1 }),
      query: jest.fn().mockResolvedValue([]),
      initialize: jest.fn(),
      isReady: jest.fn().mockReturnValue(true),
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TodoRepository,
        { provide: SqliteAdapterService, useValue: mockDb },
      ],
    });

    repository = TestBed.inject(TodoRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return paginated todos', async () => {
      mockDb.query
        .mockResolvedValueOnce([{ total: 1 }] as any)
        .mockResolvedValueOnce([{
          id: 1,
          title: 'Test',
          description: null,
          completed: 0,
          categoryId: 1,
          createdAt: '2024-01-01',
          categoryName: 'Work',
          categoryColor: '#ff0000',
        }] as any);

      const result = await repository.getAll('all');

      expect(result.data.length).toBe(1);
      expect(result.pagination.totalItems).toBe(1);
    });

    it('should filter by active status', async () => {
      mockDb.query
        .mockResolvedValueOnce([{ total: 0 }] as any)
        .mockResolvedValueOnce([] as any);

      await repository.getAll('active');

      const call = mockDb.query.mock.calls[1];
      expect(call[0]).toContain('completed');
    });
  });

  describe('getById', () => {
    it('should return todo by id', async () => {
      mockDb.query.mockResolvedValue([{
        id: 1,
        title: 'Test',
        description: null,
        completed: 0,
        categoryId: 1,
        createdAt: '2024-01-01',
        categoryName: 'Work',
        categoryColor: '#ff0000',
      }] as any);

      const result = await repository.getById(1);

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Test');
    });

    it('should return null if not found', async () => {
      mockDb.query.mockResolvedValue([] as any);

      const result = await repository.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should insert a new todo', async () => {
      const data: TodoFormData = {
        title: 'New Todo',
        categoryId: 1,
      };

      const result = await repository.create(data);

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('INSERT INTO todos');
      expect(call[1]).toContain('New Todo');
      expect(result.title).toBe('New Todo');
      expect(result.completed).toBe(false);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      await repository.update(1, { title: 'Updated' });

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('UPDATE todos');
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      await repository.delete(1);

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('DELETE FROM todos');
      expect(call[1]).toEqual([1]);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion', async () => {
      await repository.toggleComplete(1);

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('completed = NOT completed');
    });
  });

  describe('deleteCompleted', () => {
    it('should delete all completed todos', async () => {
      await repository.deleteCompleted();

      expect(mockDb.execute).toHaveBeenCalled();
      const call = mockDb.execute.mock.calls[0];
      expect(call[0]).toContain('DELETE FROM todos WHERE completed = 1');
    });
  });

  describe('getByCategory', () => {
    it('should return todos for a category', async () => {
      mockDb.query.mockResolvedValue([{
        id: 1,
        title: 'Test',
        description: null,
        completed: 0,
        categoryId: 1,
        createdAt: '2024-01-01',
        categoryName: 'Work',
        categoryColor: '#ff0000',
      }] as any);

      const result = await repository.getByCategory(1);

      expect(result.length).toBe(1);
      expect(mockDb.query).toHaveBeenCalled();
      const call = mockDb.query.mock.calls[0];
      expect(call[0]).toContain('categoryId');
    });
  });
});
