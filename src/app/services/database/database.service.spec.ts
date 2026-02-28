import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service';
import { SqliteAdapterService } from '@adapters/sqlite.adapter';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockAdapter: jest.Mocked<SqliteAdapterService>;

  beforeEach(() => {
    mockAdapter = {
      initialize: jest.fn().mockResolvedValue(undefined),
      execute: jest.fn(),
      query: jest.fn(),
      isReady: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<SqliteAdapterService>;

    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        { provide: SqliteAdapterService, useValue: mockAdapter },
      ],
    });

    service = TestBed.inject(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    it('should initialize the adapter', async () => {
      await service.initialize();
      expect(mockAdapter.initialize).toHaveBeenCalled();
    });

    it('should not reinitialize if already initialized', async () => {
      await service.initialize();
      await service.initialize();
      expect(mockAdapter.initialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAdapter', () => {
    it('should return the SQLite adapter', () => {
      const adapter = service.getAdapter();
      expect(adapter).toBe(mockAdapter);
    });
  });
});
