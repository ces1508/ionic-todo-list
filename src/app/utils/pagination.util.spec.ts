import { 
  calculatePagination, 
  calculateTotalPages, 
  buildPaginatedResponse 
} from './pagination.util';

describe('pagination.util', () => {
  describe('calculatePagination', () => {
    it('should return default values for undefined inputs', () => {
      const result = calculatePagination();
      
      expect(result.skip).toBe(0);
      expect(result.limit).toBe(20);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });

    it('should calculate skip and limit correctly', () => {
      const result = calculatePagination(2, 10);
      
      expect(result.skip).toBe(10);
      expect(result.limit).toBe(10);
      expect(result.page).toBe(2);
    });

    it('should handle page 1', () => {
      const result = calculatePagination(1, 20);
      
      expect(result.skip).toBe(0);
      expect(result.limit).toBe(20);
    });

    it('should return page 1 for invalid page values', () => {
      const result = calculatePagination(0, 20);
      expect(result.page).toBe(1);
      
      const result2 = calculatePagination(-1, 20);
      expect(result2.page).toBe(1);
    });

    it('should return pageSize 20 for invalid pageSize', () => {
      const result = calculatePagination(1, 0);
      expect(result.pageSize).toBe(20);
      
      const result2 = calculatePagination(1, -5);
      expect(result2.pageSize).toBe(1);
    });
  });

  describe('calculateTotalPages', () => {
    it('should return 0 for 0 items', () => {
      expect(calculateTotalPages(0, 20)).toBe(0);
    });

    it('should return 0 for negative items', () => {
      expect(calculateTotalPages(-10, 20)).toBe(0);
    });

    it('should calculate total pages correctly', () => {
      expect(calculateTotalPages(100, 20)).toBe(5);
      expect(calculateTotalPages(101, 20)).toBe(6);
    });
  });

  describe('buildPaginatedResponse', () => {
    it('should build paginated response', () => {
      const data = [1, 2, 3];
      const result = buildPaginatedResponse(data, 1, 20, 100);
      
      expect(result.data).toEqual(data);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(20);
      expect(result.pagination.totalItems).toBe(100);
      expect(result.pagination.totalPages).toBe(5);
    });

    it('should handle empty data', () => {
      const result = buildPaginatedResponse([], 1, 20, 0);
      
      expect(result.data).toEqual([]);
      expect(result.pagination.totalPages).toBe(0);
    });
  });
});
