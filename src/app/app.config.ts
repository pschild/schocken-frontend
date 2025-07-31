import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  ErrorHandler,
  importProvidersFrom,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import { DateFnsAdapter, MAT_DATE_FNS_FORMATS, provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { authHttpInterceptorFn, AuthService, provideAuth0 } from '@auth0/auth0-angular';
import { de } from 'date-fns/locale';
import { catchError, defer, firstValueFrom, iif, of, switchMap, tap, throwError } from 'rxjs';
import { ApiModule as NgOpenapiGenApiModule } from './api/ng-openapi-gen/api.module';
import { ApiModule as OpenApiModule, Configuration, PlayerService } from './api/openapi';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './global-error-handler';
import { ConfigService, CURRENT_PLAYER_ID } from './shared/config.service';
import { retryInterceptorFn } from './shared/interceptors/retry.interceptor';

registerLocaleData(localeDe, 'de');

const auth0Domain = 'dev-c-7e-fhc.eu.auth0.com';
const auth0ClientId = 'O9kriQaXDofZeJZzCcR8Iafj7WC8BuWh';
const auth0Audience = 'http://localhost:3001';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn, retryInterceptorFn])),
    provideAuth0({
      domain: auth0Domain,
      clientId: auth0ClientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: auth0Audience,
        ui_locales: 'de'
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `/api/*`,
            tokenOptions: {
              authorizationParams: {
                audience: auth0Audience,
              }
            }
          }
        ]
      }
    }),
    {provide: MAT_DATE_LOCALE, useValue: de},
    {provide: DateAdapter, useClass: DateFnsAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS},
    provideDateFnsAdapter(),
    importProvidersFrom(
      NgOpenapiGenApiModule.forRoot({rootUrl: `/api`}),
      OpenApiModule.forRoot(() => new Configuration({basePath: `/api`})),
    ),
    provideAnimationsAsync(),
    provideAppInitializer(() => {
      const initializerFn = (() => {
        const iconRegistry = inject(MatIconRegistry);
        const sanitizer = inject(DomSanitizer);
        return () => {
          iconRegistry.addSvgIcon('schock_aus', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/schock-aus.svg'));
          iconRegistry.addSvgIcon('whatsapp', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icons8-whatsapp.svg'));
          iconRegistry.addSvgIcon('user_star', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/user-star-svgrepo-com.svg'));
        };
      })();
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = ((configService: ConfigService, playerService: PlayerService, auth: AuthService) => {
        return () => {
          return firstValueFrom(
            auth.user$.pipe(
              switchMap(user => {
                return iif(
                  () => !!user && !!user?.sub,
                  defer(() => playerService.getPlayerByUserId(user!.sub!).pipe(
                    catchError(err => {
                      if (err.status === 403) {
                        return of(null);
                      }
                      return throwError(() => err);
                    })
                  )),
                  of(null)
                );
              }),
              tap(player => configService.setCurrentPlayer(player))
            )
          );
        };
      })(inject(ConfigService), inject(PlayerService), inject(AuthService));
      return initializerFn();
    }),
    {
      provide: CURRENT_PLAYER_ID,
      deps: [ConfigService],
      useFactory: (configService: ConfigService) => configService.getCurrentPlayerId(),
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
      useValue: {duration: 2500}
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
  ]
};
