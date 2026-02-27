import { Injectable, inject } from '@angular/core';
import { Category, CategoryFormData } from '@models/category.model';
import {
  PaginationParams,
  calculatePagination,
  buildPaginatedResponse,
  PaginatedResult,
} from '@utils/pagination.util';
import { SqliteAdapterService } from '@adapters/sqlite.adapter';

// Query constants
const CATEGORY_SELECT_BASE = 'SELECT * FROM categories';

const CATEGORY_TABLE = 'categories';

interface CategoryRow {
  id: number;
  name: string;
  color: string | null;
  isActive: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryRepository {
  private readonly db = inject(SqliteAdapterService);

  async getAll(
    pagination?: PaginationParams,
    includeInactive = false
  ): Promise<PaginatedResult<Category>> {
    const { skip, limit, page, pageSize } = calculatePagination(
      pagination?.page,
      pagination?.pageSize || 20
    );

    // Build WHERE clause
    const whereClause = includeInactive ? '' : 'WHERE isActive = 1';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ${CATEGORY_TABLE} ${whereClause}`;
    const countResult = await this.db.query<{ total: number }>(countQuery, []);
    const totalItems = countResult[0]?.total || 0;

    // Get paginated results
    const query = `${CATEGORY_SELECT_BASE} ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const result = await this.db.query<CategoryRow>(query, [limit, skip]);

    const categories = result.map((row) => this.mapRowToCategory(row));

    return buildPaginatedResponse(categories, page, pageSize, totalItems);
  }

  async getById(id: number): Promise<Category | null> {
    const query = `${CATEGORY_SELECT_BASE} WHERE id = ?`;
    const result = await this.db.query<CategoryRow>(query, [id]);

    if (result.length === 0) return null;

    return this.mapRowToCategory(result[0]);
  }

  async create(data: CategoryFormData): Promise<Category> {
    const createdAt = new Date().toISOString();

    const result = await this.db.execute(
      'INSERT INTO categories (name, color, isActive, createdAt) VALUES (?, ?, ?, ?)',
      [data.name, data.color || null, 1, createdAt]
    );

    return {
      id: result.insertId!,
      name: data.name,
      color: data.color || '',
      isActive: 1,
      createdAt: new Date(createdAt),
    };
  }

  async update(id: number, data: CategoryFormData): Promise<void> {
    await this.db.execute(
      `UPDATE ${CATEGORY_TABLE} SET name = ?, color = ? WHERE id = ?`,
      [data.name, data.color || null, id]
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.execute(`UPDATE ${CATEGORY_TABLE} SET isActive = 0 WHERE id = ?`, [id]);
  }

  async restore(id: number): Promise<void> {
    await this.db.execute(`UPDATE ${CATEGORY_TABLE} SET isActive = 1 WHERE id = ?`, [id]);
  }

  async permanentlyDelete(id: number): Promise<void> {
    await this.db.execute(`DELETE FROM ${CATEGORY_TABLE} WHERE id = ?`, [id]);
  }

  /**
   * Maps a database row to a Category object
   */
  private mapRowToCategory(row: CategoryRow): Category {
    return {
      id: row.id,
      name: row.name,
      color: row.color || '',
      isActive: row.isActive,
      createdAt: new Date(row.createdAt),
    };
  }
}
