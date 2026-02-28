import { normalizeString } from './normalize-string';

describe('normalizeString', () => {
  it('should convert to lowercase', () => {
    expect(normalizeString('HELLO')).toBe('hello');
  });

  it('should trim whitespace', () => {
    expect(normalizeString('  hello  ')).toBe('hello');
  });

  it('should remove accents', () => {
    expect(normalizeString('café')).toBe('cafe');
    expect(normalizeString('ñoño')).toBe('nono');
  });

  it('should handle empty string', () => {
    expect(normalizeString('')).toBe('');
  });

  it('should handle special characters', () => {
    expect(normalizeString('test@#$%')).toBe('test@#$%');
  });

  it('should handle normal text', () => {
    expect(normalizeString('Hello World')).toBe('hello world');
  });
});
