import { Injectable, inject } from '@angular/core';
import { SqliteAdapterService } from '@adapters/sqlite.adapter';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private readonly sqliteAdapter = inject(SqliteAdapterService);

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Si ya hay una inicialización en progreso, esperar
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInitialize();

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async doInitialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.sqliteAdapter.initialize();
    this.isInitialized = true;
  }

  getAdapter(): SqliteAdapterService {
    return this.sqliteAdapter;
  }

}
