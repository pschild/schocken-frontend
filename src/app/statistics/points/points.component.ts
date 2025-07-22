import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PointsStatisticsResponseDto } from '../../api/openapi';
import { HelpDialogComponent } from '../../dialog/help-dialog/help-dialog.component';
import { PointsTableComponent } from '../points-table/points-table.component';
import { GameSelectorComponent } from '../../shared/game-selector/game-selector.component';

@Component({
  selector: 'hop-points',
  imports: [
    PointsTableComponent,
    DatePipe,
    MatIcon,
    ReactiveFormsModule,
    MatButton,
    MatSlideToggle,
    GameSelectorComponent
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

  gamesWithId = computed(() => {
    return this.data() ? this.data()!.pointsPerGame.map(item => ({ ...item, id: item.gameId, datetime: item.datetime })) : [];
  });

  selectedGameId = signal<string | null>(null);

  dateOfFirstGame = computed(() => {
    return this.data()?.pointsPerGame[0].datetime;
  });

  pointsPerGame = computed(() => {
    return this.data()?.pointsPerGame.find(game => game.gameId === this.selectedGameId());
  });

  accumulatedPoints = computed(() => {
    return this.data()?.accumulatedPoints.find(game => game.gameId === this.selectedGameId());
  });

  showExpandedColums = new FormControl<boolean>(false);

  onSelectionChanged(gameId: string) {
    this.selectedGameId.set(gameId);
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
