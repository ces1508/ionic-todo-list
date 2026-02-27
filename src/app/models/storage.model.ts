export interface Storage {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllItems<T>(params: Record<string, any>): Promise<Record<string, T>>;
}
