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
  };

  const mockTodosPage1: Todo[] = [
    { id: 1, title: 'Todo 1', completed: false, createdAt: new Date(), categoryId: 1 },
    { id: 2, title: 'Todo 2', completed: true, createdAt: new Date(), categoryId: 1 },
  ];

  const mockTodosPage2: Todo[] = [
    { id: 3, title: 'Todo 3', completed: false, createdAt: new Date(), categoryId: 2 },
    { id: 4, title: 'Todo 4', completed: false, createdAt: new Date(), categoryId: 2 },
  ];

  const paginatedResponse = (data: Todo[], page: number, total: number) => ({
    data,
    pagination: {
      page,
      pageSize: 20,
      totalItems: total,
      totalPages: Math.ceil(total / 20),
    },
  });

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn().mockResolvedValue(paginatedResponse(mockTodosPage1, 1, 40)),
      create: jest.fn().mockResolvedValue(mockTodosPage1[0]),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      toggleComplete: jest.fn().mockResolvedValue(undefined),
      deleteCompleted: jest.fn().mockResolvedValue(undefined),
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
    it('should load todos from repository with default page 1', async () => {
      await service.loadTodos();
      expect(mockRepository.getAll).toHaveBeenCalledWith('all', undefined, { page: 1, pageSize: 20 });
      expect(service.todos()).toEqual(mockTodosPage1);
    });

    it('should load specific page', async () => {
      mockRepository.getAll.mockResolvedValueOnce(paginatedResponse(mockTodosPage2, 2, 40));
      await service.loadTodos(2);
      expect(mockRepository.getAll).toHaveBeenCalledWith('all', undefined, { page: 2, pageSize: 20 });
    });

    it('should set loading state during load', async () => {
      const loadPromise = service.loadTodos();
      expect(service.loading()).toBe(true);
      await loadPromise;
      expect(service.loading()).toBe(false);
    });

    it('should update hasMorePages based on total items', async () => {
      await service.loadTodos(1);
      expect(service.hasMorePages()).toBe(true);
    });

    it('should set hasMorePages to false when all items loaded', async () => {
      mockRepository.getAll.mockResolvedValueOnce(paginatedResponse(mockTodosPage1, 1, 2));
      await service.loadTodos(1);
      expect(service.hasMorePages()).toBe(false);
    });
  });

  describe('loadMoreTodos', () => {
    it('should load next page and append todos', async () => {
      await service.loadTodos(1);
      mockRepository.getAll.mockResolvedValueOnce(paginatedResponse(mockTodosPage2, 2, 40));
      
      await service.loadMoreTodos();
      
      expect(service.todos().length).toBe(4);
      expect(service.currentPage()).toBe(2);
    });

    it('should not load more if already loading', async () => {
      await service.loadTodos(1);
      mockRepository.getAll.mockResolvedValueOnce(paginatedResponse(mockTodosPage2, 2, 40));
      
      service.loadMoreTodos();
      service.loadMoreTodos();
      
      expect(mockRepository.getAll).toHaveBeenCalledTimes(2);
    });

    it('should not load more if no more pages', async () => {
      mockRepository.getAll.mockResolvedValueOnce(paginatedResponse(mockTodosPage1, 1, 2));
      await service.loadTodos(1);
      
      await service.loadMoreTodos();
      
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('refresh', () => {
    it('should reset pagination and load first page', async () => {
      await service.loadTodos(2);
      
      await service.refresh();
      
      expect(service.currentPage()).toBe(1);
      expect(service.hasMorePages()).toBe(true);
      expect(mockRepository.getAll).toHaveBeenCalledWith('all', undefined, { page: 1, pageSize: 20 });
    });
  });

  describe('setFilter', () => {
    it('should update filter and call refresh', async () => {
      await service.loadTodos(1);
      
      service.setFilter('active');
      
      expect(service.filter()).toBe('active');
      expect(mockRepository.getAll).toHaveBeenCalledWith('active', undefined, { page: 1, pageSize: 20 });
    });

    it('should not refresh if filter is the same', async () => {
      await service.loadTodos(1);
      
      service.setFilter('all');
      
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('setCategoryFilter', () => {
    it('should update category filter and call refresh', async () => {
      await service.loadTodos(1);
      
      service.setCategoryFilter(1);
      
      expect(service.categoryFilter()).toBe(1);
      expect(mockRepository.getAll).toHaveBeenCalledWith('all', 1, { page: 1, pageSize: 20 });
    });

    it('should clear category filter when undefined', async () => {
      service.setCategoryFilter(1);
      
      service.setCategoryFilter(undefined);
      
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
    it('should add todo and prepend to internal list', async () => {
      await service.loadTodos();
      
      const newTodo = { title: 'New Todo', categoryId: 1 };
      await service.addTodo(newTodo);
      
      expect(service.todos().length).toBe(3);
    });
  });

  describe('updateTodo', () => {
    it('should update todo in list', async () => {
      await service.loadTodos();
      
      await service.updateTodo(1, { title: 'Updated' });
      
      expect(service.todos()[0].title).toBe('Updated');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion', async () => {
      await service.loadTodos();
      
      await service.toggleTodo(1);
      
      expect(service.todos()[0].completed).toBe(true);
    });
  });

  describe('deleteTodo', () => {
    it('should remove todo from list', async () => {
      await service.loadTodos();
      
      await service.deleteTodo(1);
      
      expect(service.todos().length).toBe(1);
      expect(service.todos()[0].id).toBe(2);
    });
  });

  describe('clearCompleted', () => {
    it('should call repository and refresh', async () => {
      await service.loadTodos();
      
      await service.clearCompleted();
      
      expect(mockRepository.deleteCompleted).toHaveBeenCalled();
    });
  });

  describe('getTodoById', () => {
    it('should return todo by id', async () => {
      await service.loadTodos();
      
      const todo = service.getTodoById(1);
      
      expect(todo).toEqual(mockTodosPage1[0]);
    });

    it('should return undefined for non-existent id', async () => {
      await service.loadTodos();
      
      const todo = service.getTodoById(999);
      
      expect(todo).toBeUndefined();
    });
  });
});
