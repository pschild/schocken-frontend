import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'hop-handle-verloren-event-dialog',
  imports: [
    MatButton,
    MatDialogModule
  ],
  templateUrl: './handle-verloren-event-dialog.component.html',
  styleUrl: './handle-verloren-event-dialog.component.scss'
})
export class HandleVerlorenEventDialogComponent {
  data: { playerName: string } = inject(MAT_DIALOG_DATA);
}
