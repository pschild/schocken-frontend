import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';
import { ApiModule as NgOpenapiGenApiModule } from './api/ng-openapi-gen/api.module';
import { ApiModule as OpenApiModule, Configuration } from './api/openapi';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe, 'de');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    provideNativeDateAdapter(),
    importProvidersFrom(
      NgOpenapiGenApiModule.forRoot({rootUrl: 'http://localhost:3001'}),
      OpenApiModule.forRoot(() => new Configuration({basePath: 'http://localhost:3001'}))
    ),
    provideAnimationsAsync(),
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'EUR'
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    },
  ]
};
