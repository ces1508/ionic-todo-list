export const SCHEMA_VERSION = 1;

export const TABLES = {
  CATEGORIES: 'categories',
  TODOS: 'todos',
} as const;

export const TABLE_SCHEMAS = {
  [TABLES.CATEGORIES]: `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `,
  [TABLES.TODOS]: `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0,
      categoryId INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
    )
  `,
} as const;

export const INDEX_SCHEMAS = {
  [TABLES.CATEGORIES]: [
    `CREATE INDEX IF NOT EXISTS idx_categories_isActive ON categories(isActive)`,
    `CREATE INDEX IF NOT EXISTS idx_categories_createdAt ON categories(createdAt)`,
  ],
  [TABLES.TODOS]: [
    `CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed)`,
    `CREATE INDEX IF NOT EXISTS idx_todos_categoryId ON todos(categoryId)`,
    `CREATE INDEX IF NOT EXISTS idx_todos_createdAt ON todos(createdAt)`,
    `CREATE INDEX IF NOT EXISTS idx_todos_category_completed ON todos(categoryId, completed)`,
  ],
} as const;
