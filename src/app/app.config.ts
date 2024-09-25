import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  ErrorHandler,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ApiModule as NgOpenapiGenApiModule } from './api/ng-openapi-gen/api.module';
import { ApiModule as OpenApiModule, Configuration } from './api/openapi';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './global-error-handler';

registerLocaleData(localeDe, 'de');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    provideNativeDateAdapter(),
    importProvidersFrom(
      NgOpenapiGenApiModule.forRoot({rootUrl: 'http://localhost:3000'}),
      OpenApiModule.forRoot(() => new Configuration({basePath: 'http://localhost:3000'}))
    ),
    provideAnimationsAsync(),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {autoFocus: 'dialog'}
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'EUR'
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
  ]
};
