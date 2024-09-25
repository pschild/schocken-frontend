import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SuccessMessageService {
  private snackBar = inject(MatSnackBar);

  showSuccess(message: string): void {
    this.snackBar.open(message);
  }
}
