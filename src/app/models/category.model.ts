export interface Category {
  id: number;
  name: string;
  color: string;
  isActive: number;
  createdAt: Date;
}

export interface CategoryFormData {
  name: string;
  color: string;
}

export const CATEGORY_COLORS = [
  '#EF476F', // Red/Pink
  '#FFD166', // Yellow
  '#06D6A0', // Green
  '#118AB2', // Blue
  '#9D4EDD', // Purple
  '#FF6B6B', // Coral
];
