import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './dialog/error-dialog/error-dialog.component';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  dialog = inject(MatDialog);

  handleError(error: any): void {
    console.error(error);
    if (error instanceof HttpErrorResponse) {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          userMessage: error.error.message,
          message: error.message,
        }
      });
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
