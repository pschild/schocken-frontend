import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  ErrorHandler,
  importProvidersFrom, inject,
  LOCALE_ID,
  provideZoneChangeDetection
} from '@angular/core';
import { DateFnsAdapter, MAT_DATE_FNS_FORMATS, provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ApiModule as NgOpenapiGenApiModule } from './api/ng-openapi-gen/api.module';
import { ApiModule as OpenApiModule, Configuration } from './api/openapi';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './global-error-handler';
import { de } from 'date-fns/locale';

registerLocaleData(localeDe, 'de');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    { provide: MAT_DATE_LOCALE, useValue: de },
    { provide: DateAdapter, useClass: DateFnsAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS },
    provideDateFnsAdapter(),
    importProvidersFrom(
      NgOpenapiGenApiModule.forRoot({rootUrl: 'http://localhost:3000'}),
      OpenApiModule.forRoot(() => new Configuration({basePath: 'http://localhost:3000'})),
    ),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const iconRegistry = inject(MatIconRegistry);
        const sanitizer = inject(DomSanitizer);
        return () => {
          iconRegistry.addSvgIcon('schock_aus', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/schock-aus.svg'));
        };
      },
    },
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
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 }
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
  ]
};
