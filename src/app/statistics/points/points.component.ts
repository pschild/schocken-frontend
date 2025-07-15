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
    return this.data() ? this.data()!.pointsPerGame.map(item => ({ ...item, id: item.gameId })) : [];
  });

  selectedGameId = signal<string | null>(null);

  selectedIndex = computed(() => {
    return this.data() ? this.data()!.pointsPerGame.findIndex(item => item.gameId === this.selectedGameId()) : -1;
  });

  // TODO: REFACTOR ME!
  info = computed(() => {
    const response = this.data();
    const selectedGameId = this.selectedGameId();
    if (!response || !selectedGameId) {
      return null;
    }
    const selectedGame = response!.pointsPerGame.find(game => game.gameId === selectedGameId);
    const accumulatedPoints = response!.accumulatedPoints.find(game => game.gameId === selectedGameId);
    return {
      datetimeOfFirstGame: response.pointsPerGame[0].datetime,
      datetime: selectedGame?.datetime,
      points: selectedGame?.points,
      accumulatedPoints: accumulatedPoints?.points,
    };
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
