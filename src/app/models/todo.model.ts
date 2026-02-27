export interface LoginForm {
  title: string;
  description?: string;
}

export interface Todo extends LoginForm {
  id: number;
  completed: boolean;
  createdAt: Date;
}



export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoFormData {
  title: string;
  description?: string;
}
