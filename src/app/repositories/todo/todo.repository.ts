import { SqliteAdapterService } from '@adapters/sqlite.adapter';
import { Injectable, inject } from '@angular/core';
import { Todo, TodoFormData, TodoFilter } from '@models/todo.model';
import {
  PaginationParams,
  calculatePagination,
  buildPaginatedResponse,
  PaginatedResult,
} from '@utils/pagination.util';

// Query constants
const TODO_SELECT_BASE = `
  SELECT 
    t.id, 
    t.title, 
    t.description, 
    t.completed, 
    t.categoryId, 
    t.createdAt,
    c.name as categoryName,
    c.color as categoryColor
  FROM todos t
  LEFT JOIN categories c ON t.categoryId = c.id AND c.isActive = 1
`;

const TODO_TABLE = 'todos';

interface TodoRow {
  id: number;
  title: string;
  description: string | null;
  completed: number;
  categoryId: number | null;
  createdAt: string;
  categoryName: string | null;
  categoryColor: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TodoRepository {
  private readonly db = inject(SqliteAdapterService);

  async getAll(
    filter?: TodoFilter,
    categoryId?: number,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Todo>> {
    const { skip, limit, page, pageSize } = calculatePagination(
      pagination?.page,
      pagination?.pageSize || 20
    );

    const { whereClause, params } = this.buildFilterClause(filter, categoryId);

    const countQuery = `SELECT COUNT(*) as total FROM ${TODO_TABLE} ${whereClause}`;
    const countResult = await this.db.query<{ total: number }>(countQuery, params);
    const totalItems = countResult[0]?.total || 0;

    const query = `${TODO_SELECT_BASE} ${whereClause} ORDER BY t.createdAt DESC LIMIT ? OFFSET ?`;
    const result = await this.db.query<TodoRow>(query, [...params, limit, skip]);

    const todos = result.map((row) => this.mapRowToTodo(row));

    return buildPaginatedResponse(todos, page, pageSize, totalItems);
  }

  async getById(id: number): Promise<Todo | null> {
    const query = `${TODO_SELECT_BASE} WHERE t.id = ?`;
    const result = await this.db.query<TodoRow>(query, [id]);

    if (result.length === 0) return null;

    return this.mapRowToTodo(result[0]);
  }

  async create(data: TodoFormData): Promise<Todo> {
    const createdAt = new Date().toISOString();

    const result = await this.db.execute(
      'INSERT INTO todos (title, description, completed, categoryId, createdAt) VALUES (?, ?, ?, ?, ?)',
      [
        data.title,
        data.description || null,
        0,
        data.categoryId || null,
        createdAt,
      ]
    );

    return {
      id: result.insertId!,
      title: data.title,
      description: data.description,
      completed: false,
      categoryId: data.categoryId,
      createdAt: new Date(createdAt),
    };
  }

  async update(id: number, data: Partial<TodoFormData>): Promise<void> {
    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      params.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description || null);
    }
    if (data.categoryId !== undefined) {
      updates.push('categoryId = ?');
      params.push(data.categoryId || null);
    }

    updates.push("updatedAt = datetime('now')");
    params.push(id);

    await this.db.execute(
      `UPDATE ${TODO_TABLE} SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
  }

  async toggleComplete(id: number): Promise<void> {
    await this.db.execute(
      "UPDATE todos SET completed = NOT completed, updatedAt = datetime('now') WHERE id = ?",
      [id]
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.execute(`DELETE FROM ${TODO_TABLE} WHERE id = ?`, [id]);
  }

  async deleteCompleted(): Promise<void> {
    await this.db.execute(`DELETE FROM ${TODO_TABLE} WHERE completed = 1`);
  }

  async getByCategory(categoryId: number): Promise<Todo[]> {
    const query = `${TODO_SELECT_BASE} WHERE t.categoryId = ? ORDER BY t.createdAt DESC`;
    const result = await this.db.query<TodoRow>(query, [categoryId]);

    return result.map((row) => this.mapRowToTodo(row));
  }

  /**
   * Builds WHERE clause and params based on filter and category
   */
  private buildFilterClause(
    filter?: TodoFilter,
    categoryId?: number
  ): { whereClause: string; params: (string | number | null)[] } {
    const params: (string | number | null)[] = [];
    const conditions: string[] = [];

    if (categoryId !== undefined) {
      conditions.push('categoryId = ?');
      params.push(categoryId);
    }

    if (filter && filter !== 'all') {
      if (filter === 'active') {
        conditions.push('completed = ?');
        params.push(0);
      } else if (filter === 'completed') {
        conditions.push('completed = ?');
        params.push(1);
      }
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    return { whereClause, params };
  }

  /**
   * Maps a database row to a Todo object
   */
  private mapRowToTodo(row: TodoRow): Todo {
    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      completed: row.completed === 1,
      categoryId: row.categoryId || undefined,
      categoryName: row.categoryName || undefined,
      categoryColor: row.categoryColor || undefined,
      createdAt: new Date(row.createdAt),
    };
  }
}
