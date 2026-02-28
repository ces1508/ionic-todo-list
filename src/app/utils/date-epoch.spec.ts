import { dateToEpoch } from './date-epoch';

describe('date-epoch', () => {
  it('should convert Date to epoch time', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const epoch = dateToEpoch(date);
    
    expect(epoch).toBe(1704067200);
  });

  it('should floor the epoch time', () => {
    const date = new Date(1704067201000); // With milliseconds
    const epoch = dateToEpoch(date);
    
    expect(epoch).toBe(1704067201);
  });

  it('should handle current date', () => {
    const now = new Date();
    const epoch = dateToEpoch(now);
    
    expect(epoch).toBeDefined();
    expect(typeof epoch).toBe('number');
  });
});
