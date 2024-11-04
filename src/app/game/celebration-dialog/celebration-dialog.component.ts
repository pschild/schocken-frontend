import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { CelebrationDto } from '../../api/openapi';
import { OdometerComponent } from '../../odometer/odometer.component';
import { CelebrationDirective } from '../../shared/celebration.directive';
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
    MatIcon,
    CelebrationDirective
  ],
  templateUrl: './celebration-dialog.component.html',
  styleUrl: './celebration-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CelebrationDialogComponent {
  data: { celebration: CelebrationDto } = inject(MAT_DIALOG_DATA);
}
