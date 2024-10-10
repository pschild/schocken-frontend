import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'hop-edit-attendance-dialog',
  standalone: true,
  imports: [],
  templateUrl: './edit-attendance-dialog.component.html',
  styleUrl: './edit-attendance-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAttendanceDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditAttendanceDialogComponent>);
  data: {  } = inject(MAT_DIALOG_DATA);
}
