import {
  ApplicationConfig,
  APP_INITIALIZER,
  inject,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
} from '@angular/router';
import {
  provideIonicAngular,
  IonicRouteStrategy,
} from '@ionic/angular/standalone';

import { routes } from './app-routes';
import { SqliteAdapterService } from '@adapters/sqlite.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'ios',
    }),
    {
      provide: SqliteAdapterService,
      useFactory: () => {
        const service = new SqliteAdapterService();
        service.initialize().then(() => console.log('database initalize'));
        return service;
      },
    },
  ],
};
