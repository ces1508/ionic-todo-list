import {
  Injectable,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  RemoteConfig,
  fetchAndActivate,
  getAll,
} from '@angular/fire/remote-config';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private readonly remoteConfig = inject(RemoteConfig);
  private readonly injector = inject(EnvironmentInjector);

  private initialized = false;
  private values: Record<string, string> = {};

  start(): void {
    if (this.initialized) return;

    this.remoteConfig.defaultConfig = {
      dowonloadReport: true,
      minimumFetchIntervalMillis: 0,
    };

    this.load();
  }

  async load(): Promise<void> {
    if (this.initialized) return;

    return runInInjectionContext(this.injector, async () => {
      try {
        await fetchAndActivate(this.remoteConfig);

        const all = getAll(this.remoteConfig);
        const parsed: Record<string, string> = {};

        for (const [key, value] of Object.entries(all)) {
          parsed[key] = value.asString();
        }

        this.values = parsed;
      } finally {
        this.initialized = true;
      }
    });
  }

  getBoolean(key: string, fallback = false): boolean {
    const v = this.values[key];
    if (v === undefined) return fallback;
    return v === 'true';
  }

  getString(key: string, fallback = ''): string {
    return this.values[key] ?? fallback;
  }

  getNumber(key: string, fallback = 0): number {
    const v = Number(this.values[key]);
    return Number.isNaN(v) ? fallback : v;
  }
}