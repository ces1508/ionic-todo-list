import { Todo } from '@models/todo.model';

export interface TodoCSVRow {
  nombre: string;
  estado: string;
  descripcion: string;
  categoria_nombre: string;
  categoria_color: string;
}

/**
 * Converts an array of Todo objects to CSV format
 * Fields: nombre, estado, descripcion, categoria_nombre, categoria_color
 */
export function convertTodosToCSV(todos: Todo[]): string {
  const headers = ['nombre', 'estado', 'descripcion', 'categoria_nombre', 'categoria_color'];

  const rows: string[][] = todos.map((todo) => {
    const estado = todo.completed ? 'completed' : 'active';
    const descripcion = todo.description || '';
    const categoria_nombre = todo.categoryName || '';
    const categoria_color = todo.categoryColor || '';

    return [
      todo.title,
      estado,
      descripcion,
      categoria_nombre,
      categoria_color,
    ];
  });

  // Escape CSV values (wrap in quotes and escape existing quotes)
  const escapeCSV = (value: string): string => {
    return `"${value.replace(/"/g, '""')}"`;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Creates a File object from CSV content
 */
export function createCSVFile(todos: Todo[], filename = 'todos.csv'): File {
  const csv = convertTodosToCSV(todos);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  return new File([blob], filename, { type: 'text/csv' });
}
