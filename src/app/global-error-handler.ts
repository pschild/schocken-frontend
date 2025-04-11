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
      if (error.status === 403) {
        this.router.navigate(['forbidden']);
      } else {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            userMessage: error.error.message,
            message: error.message,
          }
        });
      }
    } else {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          userMessage: 'Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es erneut.',
          message: `${error.message}\n\n${error.stack}`,
        }
      });
    }
  }
}
