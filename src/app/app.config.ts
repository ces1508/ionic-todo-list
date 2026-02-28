import {
  ApplicationConfig,
  APP_INITIALIZER,
  inject,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
  ENVIRONMENT_INITIALIZER,
  provideEnvironmentInitializer,
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
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';

import { routes } from './app-routes';
import { SqliteAdapterService } from '@adapters/sqlite.adapter';
import { environment } from '../environments/environment';
import { RemoteConfigService } from '@services/remote-config/remote-config.service';
import { APP_TEXTS_TOKEN, APP_TEXTS } from '@core/app-texts';

// Firebase app initialization function
function initializeFirebase() {
  return initializeApp(environment.firebase);
}

// Remote Config initialization function
function initializeRemoteConfig() {
  const remoteConfig = getRemoteConfig();

  // Set default values for Remote Config
  remoteConfig.defaultConfig = {
    dowonloadReport: true,
  };

  return remoteConfig;
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'ios',
    }),
    // Firebase providers
    provideFirebaseApp(initializeFirebase),
    provideRemoteConfig(initializeRemoteConfig),
    // App texts
    { provide: APP_TEXTS_TOKEN, useValue: APP_TEXTS },
    SqliteAdapterService,
    RemoteConfigService,
    provideEnvironmentInitializer(() => {
      const sqlite = inject(SqliteAdapterService);
      const remoteConfig = inject(RemoteConfigService);
      remoteConfig.load().then(() => console.log('remote config ready'));
      sqlite.initialize().then(() => console.log('database ready'));
    }),
  ],
};
