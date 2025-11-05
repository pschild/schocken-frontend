import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorDialogComponent } from './dialog/error-dialog/error-dialog.component';
import { AuthService, GenericError } from '@auth0/auth0-angular';
import { InfoDialogComponent } from './dialog/info-dialog/info-dialog.component';
import { Md5 } from 'ts-md5';
import { finalize, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

function cacheOperator(duration: number = 1000) {
  const cache = new Map<string, number>();

  return (source$: Observable<any>) => source$.pipe(
    filter(error => {
      const hash = Md5.hashStr(JSON.stringify(error));
      const now = Date.now();
      const cachedTime = cache.get(hash);

      if (cachedTime && (now - cachedTime) < duration) {
        return false;
      }

      cache.set(hash, now);
      return true;
    }),
    finalize(() => cache.clear())
  );
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  dialog = inject(MatDialog);
  router = inject(Router);
  auth = inject(AuthService);

  private errors$ = new Subject<any>();

  constructor() {
    this.errors$.pipe(
      cacheOperator(1000),
    ).subscribe(error => {
      if (error instanceof HttpErrorResponse) { // error in http communication
        if (this.isNoNetworkError(error)) {
          this.dialog.open(ErrorDialogComponent, {
            data: {
              title: 'Netzwerkfehler',
              userMessage: `Du scheinst offline zu sein. Bitte prüfe deine Internetverbindung und versuche es erneut.`,
              message: error.message,
            }
          });
        } else if (error.status === 403) {
          this.router.navigate(['forbidden']);
        } else {
          this.dialog.open(ErrorDialogComponent, {
            data: {
              title: 'Netzwerkfehler',
              userMessage: error.error?.message || error.statusText,
              message: error.message,
            }
          });
        }
      } else if (error instanceof GenericError) { // errors from auth0
        if (error.error === 'invalid_grant') { // when refresh token was invalidated/expired
          this.dialog.open(InfoDialogComponent, {
            data: {
              title: 'Hinweis',
              message: 'Deine Sitzung ist abgelaufen. Bitte logge dich neu ein.',
              buttonLabel: 'Zum Login',
            }
          })
            .afterClosed()
            .subscribe(() =>
              this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
            );
        } else {
          this.dialog.open(ErrorDialogComponent, {
            data: {
              title: 'Authentifizierungsfehler',
              userMessage: 'Bitte logge dich neu ein.',
              message: `${error.error}\n\n${error.error_description}`,
            }
          });
        }
      } else { // all other errors
        this.dialog.open(ErrorDialogComponent, {
          data: {
            title: 'Funktionsfehler',
            userMessage: 'Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es erneut.',
            message: `${error.message}\n\n${error.stack}`,
          }
        });
      }
    });
  }

  handleError(error: any): void {
    this.errors$.next(error);
  }

  private isNoNetworkError(error: HttpErrorResponse): boolean {
    return error.headers.keys().length === 0
      && !error.ok
      && error.status === 0
      && error.error.loaded === 0
      && error.error.total === 0;
  }
}
