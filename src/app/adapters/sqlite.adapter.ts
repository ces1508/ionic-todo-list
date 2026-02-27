import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { STORAGE_CONFIG } from '@core/database.constants';
import { TABLE_SCHEMAS } from '@core/database.schema';

@Injectable({
  providedIn: 'root',
})
export class SqliteAdapterService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  private isInitialized = false;
  private initializing?: Promise<void>; // 🔒 lock async

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (this.initializing) {
      return this.initializing;
    }

    this.initializing = (async () => {
      console.log('[SQLite] initialize');

      const platform = Capacitor.getPlatform();

      if (platform === 'web') {
        await this.sqlite.initWebStore();
      }

      // limpia conexiones inconsistentes
      await this.sqlite.checkConnectionsConsistency();

      const {
        DB_NAME,
        DB_VERSION,
        encrypted,
        mode,
      } = STORAGE_CONFIG;

      const { result: connectionExists } = await this.sqlite.isConnection(
        DB_NAME,
        false,
      );

      if (connectionExists) {
        this.db = await this.sqlite.retrieveConnection(
          DB_NAME,
          false,
        );
      } else {
        this.db = await this.sqlite.createConnection(
          DB_NAME,
          encrypted,
          mode,
          DB_VERSION,
          false,
        );
        console.log('open connection')
        await this.db.open();
        await this.createTables();
      }

      this.isInitialized = true;
      this.initializing = undefined;

      console.log('[SQLite] ready');
    })();

    return this.initializing;
  }


  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('SQLite connection not initialized');
    }

    // activar foreign keys
    await this.db.execute(`PRAGMA foreign_keys = ON;`);

    for (const schema of Object.values(TABLE_SCHEMAS)) {
      await this.db.execute(schema);
    }
  }

  async execute(
    query: string,
    params: (string | number | null)[] = [],
  ): Promise<{ insertId?: number; rowsAffected: number }> {
    await this.initialize();

    const result = await this.db!.run(query, params);

    return {
      insertId: result.changes?.lastId,
      rowsAffected: result.changes?.changes ?? 0,
    };
  }

  async query<T>(
    query: string,
    params: (string | number | null)[] = [],
  ): Promise<T[]> {
    await this.initialize();

    const result = await this.db!.query(query, params);
    return (result.values ?? []) as T[];
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  async close(): Promise<void> {
    if (!this.db) return;

    const dbName = this.db.getConnectionDBName();
    await this.sqlite.closeConnection(dbName, false);

    this.db = null;
    this.isInitialized = false;
  }
}