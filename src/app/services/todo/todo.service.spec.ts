import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { TodoRepository } from '@repositories/todo/todo.repository';
import { Todo, TodoFilter } from '@models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let mockRepository: {
    getAll: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    toggleComplete: jest.Mock;
    deleteCompleted: jest.Mock;
    getByCategory: jest.Mock;
  };

  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'Test Todo 1',
      completed: false,
      createdAt: new Date(),
      categoryId: 1,
    },
    {
      id: 2,
      title: 'Test Todo 2',
      completed: true,
      createdAt: new Date(),
      categoryId: 1,
    },
  ];

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn().mockResolvedValue({ data: mockTodos, total: 2 }),
      create: jest.fn().mockResolvedValue(mockTodos[0]),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      toggleComplete: jest.fn().mockResolvedValue(undefined),
      deleteCompleted: jest.fn().mockResolvedValue(undefined),
      getByCategory: jest.fn().mockResolvedValue([mockTodos[0]]),
    };

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: TodoRepository, useValue: mockRepository },
      ],
    });

    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadTodos', () => {
    it('should load todos from repository', async () => {
      await service.loadTodos();
      expect(mockRepository.getAll).toHaveBeenCalledWith('all');
      expect(service.todos()).toEqual(mockTodos);
    });

    it('should set loading state during load', async () => {
      const loadPromise = service.loadTodos();
      expect(service.loading()).toBe(true);
      await loadPromise;
      expect(service.loading()).toBe(false);
    });

    it('should handle error gracefully', async () => {
      mockRepository.getAll.mockRejectedValueOnce(new Error('DB Error'));
      await service.loadTodos();
      expect(service.loading()).toBe(false);
    });
  });

  describe('filteredTodos', () => {
    it('should return all todos when filter is all', async () => {
      await service.loadTodos();
      service.setFilter('all');
      expect(service.filteredTodos().length).toBe(2);
    });

    it('should filter active todos', async () => {
      await service.loadTodos();
      service.setFilter('active');
      expect(service.filteredTodos().length).toBe(1);
      expect(service.filteredTodos()[0].completed).toBe(false);
    });

    it('should filter completed todos', async () => {
      await service.loadTodos();
      service.setFilter('completed');
      expect(service.filteredTodos().length).toBe(1);
      expect(service.filteredTodos()[0].completed).toBe(true);
    });

    it('should filter by category', async () => {
      await service.loadTodos();
      service.setCategoryFilter(1);
      expect(service.filteredTodos().length).toBe(2);
    });

    it('should clear category filter', async () => {
      await service.loadTodos();
      service.setCategoryFilter(1);
      service.clearCategoryFilter();
      expect(service.categoryFilter()).toBeUndefined();
    });
  });

  describe('computed values', () => {
    it('should calculate active count', async () => {
      await service.loadTodos();
      expect(service.activeCount()).toBe(1);
    });

    it('should calculate completed count', async () => {
      await service.loadTodos();
      expect(service.completedCount()).toBe(1);
    });
  });

  describe('addTodo', () => {
    it('should add todo and update state', async () => {
      await service.loadTodos();
      const newTodo = { title: 'New Todo', categoryId: 1 };
      await service.addTodo(newTodo);
      expect(mockRepository.create).toHaveBeenCalledWith(newTodo);
      expect(service.todos().length).toBe(3);
    });
  });

  describe('updateTodo', () => {
    it('should update todo in state', async () => {
      await service.loadTodos();
      const updatedData = { title: 'Updated Title' };
      await service.updateTodo(1, updatedData);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updatedData);
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion status', async () => {
      await service.loadTodos();
      const initialCompleted = service.todos()[0].completed;
      await service.toggleTodo(1);
      expect(mockRepository.toggleComplete).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteTodo', () => {
    it('should remove todo from state', async () => {
      await service.loadTodos();
      await service.deleteTodo(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(service.todos().length).toBe(1);
    });
  });

  describe('clearCompleted', () => {
    it('should remove completed todos', async () => {
      await service.loadTodos();
      await service.clearCompleted();
      expect(mockRepository.deleteCompleted).toHaveBeenCalled();
      expect(service.todos().length).toBe(1);
    });
  });

  describe('getTodoById', () => {
    it('should return todo by id', async () => {
      await service.loadTodos();
      const todo = service.getTodoById(1);
      expect(todo).toEqual(mockTodos[0]);
    });

    it('should return undefined for non-existent id', async () => {
      await service.loadTodos();
      const todo = service.getTodoById(999);
      expect(todo).toBeUndefined();
    });
  });
});
