import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CelebrationDirective } from '../../shared/celebration.directive';

@Component({
  selector: 'hop-handle-verloren-event-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogModule,
    CelebrationDirective
  ],
  templateUrl: './handle-verloren-event-dialog.component.html',
  styleUrl: './handle-verloren-event-dialog.component.scss'
})
export class HandleVerlorenEventDialogComponent {
  data: { playerName: string } = inject(MAT_DIALOG_DATA);
}
