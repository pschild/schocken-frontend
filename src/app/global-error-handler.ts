import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorDialogComponent } from './dialog/error-dialog/error-dialog.component';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  dialog = inject(MatDialog);
  router = inject(Router);

  handleError(error: any): void {
    console.error(error);
    if (error instanceof HttpErrorResponse) {
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
    } else {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          title: 'Funktionsfehler',
          userMessage: 'Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es erneut.',
          message: `${error.message}\n\n${error.stack}`,
        }
      });
    }
  }

  private isNoNetworkError(error: HttpErrorResponse): boolean {
    return error.headers.keys().length === 0
      && !error.ok
      && error.status === 0
      && error.error.loaded === 0
      && error.error.total === 0;
  }
}
