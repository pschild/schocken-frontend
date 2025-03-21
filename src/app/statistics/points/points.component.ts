import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { PointsStatisticsResponseDto } from '../../api/openapi';
import { HelpDialogComponent } from '../../dialog/help-dialog/help-dialog.component';
import { PointsTableComponent } from '../points-table/points-table.component';

@Component({
  selector: 'hop-points',
  imports: [
    PointsTableComponent,
    DatePipe,
    MatIcon,
    MatIconButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatButton
  ],
  templateUrl: './points.component.html',
  styleUrl: './points.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointsComponent {

  private dialog = inject(MatDialog);

  helpTextTpl = viewChild('helpText');

  data = input<PointsStatisticsResponseDto | null>();
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  currentIndex = computed(() => {
    return signal(this.data() && this.data()!.pointsPerGame.length > 0 ? this.data()!.pointsPerGame.length - 1 : 0);
  });

  viewTypeControl = new FormControl<boolean>(false);

  onSelectionChanged($event: MatSelectChange) {
    this.currentIndex().set($event.value);
  }

  showHelpDialog(): void {
    this.dialog.open(HelpDialogComponent, {
      data: {
        title: 'Wie funktioniert die Punktevergabe?',
        buttonLabel: 'Easy!',
        templateRef: this.helpTextTpl()
      }
    });
  }
}
