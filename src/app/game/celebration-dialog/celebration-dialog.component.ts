import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CelebrationDto } from '../../api/openapi';
import { OdometerComponent } from '../../odometer/odometer.component';
import { CelebrationDirective } from '../../shared/celebration.directive';

@Component({
  selector: 'hop-celebration-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    OdometerComponent,
    MatIcon,
    CelebrationDirective
  ],
  templateUrl: './celebration-dialog.component.html',
  styleUrl: './celebration-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CelebrationDialogComponent {
  data: { celebration: CelebrationDto } = inject(MAT_DIALOG_DATA);
}
