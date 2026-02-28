import { trimObjectValues } from './trim.util';

describe('trim.util', () => {
  it('should trim string values', () => {
    const obj = { name: '  John  ', age: 25 };
    const result = trimObjectValues(obj);
    
    expect(result.name).toBe('John');
    expect(result.age).toBe(25);
  });

  it('should handle empty strings', () => {
    const obj = { name: '' };
    const result = trimObjectValues(obj);
    
    expect(result.name).toBe('');
  });

  it('should handle non-string values', () => {
    const obj = { 
      name: 'John', 
      age: 25, 
      active: true,
      count: 100,
    };
    const result = trimObjectValues(obj);
    
    expect(result.name).toBe('John');
    expect(result.age).toBe(25);
    expect(result.active).toBe(true);
    expect(result.count).toBe(100);
  });

  it('should handle nested objects as strings', () => {
    const obj = { name: '  John  ' };
    const result = trimObjectValues(obj);
    
    expect(result).not.toBe(obj);
  });

  it('should handle null values', () => {
    const obj = { name: null as any };
    const result = trimObjectValues(obj);
    
    expect(result.name).toBeNull();
  });
});
