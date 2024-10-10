import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlayerDto } from '../../api/openapi';

@Component({
  selector: 'hop-add-event-dialog',
  standalone: true,
  imports: [],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddEventDialogComponent>);
  data: { player: PlayerDto } = inject(MAT_DIALOG_DATA);
}
