import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import confetti from 'canvas-confetti';
import { CelebrationDto } from '../../api/openapi';
import { OdometerComponent } from '../../odometer/odometer.component';
import { AddEventFormComponent } from '../add-event-dialog/add-event-form/add-event-form.component';

@Component({
  selector: 'hop-celebration-dialog',
  standalone: true,
  imports: [
    AddEventFormComponent,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    OdometerComponent,
    MatIcon
  ],
  templateUrl: './celebration-dialog.component.html',
  styleUrl: './celebration-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CelebrationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CelebrationDialogComponent>);
  data: { celebration: CelebrationDto } = inject(MAT_DIALOG_DATA);

  celebrate(e: MouseEvent): void {
    confetti({
      shapes: ['circle'],
      particleCount: 200,
      startVelocity: 30,
      spread: 120,
      zIndex: 1001,
      origin: {
        x: e.x / window.innerWidth,
        y: e.y / window.innerHeight
      }
    });
  }
}
