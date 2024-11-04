import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventDto, PlayerDto, RoundDetailDto } from '../../api/openapi';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { IsLoadingPipe } from '../../shared/loading/is-loading.pipe';
import { EventsByPlayerIdPipe } from '../../shared/pipes/events-by-player-id.pipe';
import { AddEventModel } from '../add-event-dialog/add-event-form/add-event-form.component';
import { ChoosePlayerDialogComponent } from '../choose-player-dialog/choose-player-dialog.component';
import { EventListComponent } from '../event-list/event-list.component';
import ContextEnum = EventDto.ContextEnum;

@Component({
  selector: 'hop-round',
  standalone: true,
  imports: [CommonModule, EventsByPlayerIdPipe, EventListComponent, MatButton, MatIconModule, IsLoadingPipe, MatProgressSpinner],
  templateUrl: './round.component.html',
  styleUrl: './round.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundComponent {

  round = input.required<RoundDetailDto>();
  players = input.required<PlayerDto[]>();
  activePlayers = input.required<PlayerDto[]>();
  disabled = input<boolean>(false);

  onEventAdd = output<{ context: ContextEnum; playerId: string; event: AddEventModel; roundId: string }>();
  onEventRemove = output<{ id: string; roundId: string }>();
  onRoundRemove = output<string>();
  onFinalistsChange = output<{ roundId: string; finalistIds: string[] }>();
  onAttendanceChange = output<{ roundId: string; playerIds: string[] }>();

  readonly dialog = inject(MatDialog);

  attendees = computed(() => this.players().filter(player => this.round().attendees.includes(player.id)));

  Context = ContextEnum;

  handleSelectionChange(selectedIds: string[]): void {
    this.onFinalistsChange.emit({ roundId: this.round().id, finalistIds: selectedIds });
  }

  handleEventAdd(payload: { context: ContextEnum; playerId: string; event: AddEventModel }): void {
    this.onEventAdd.emit({ ...payload, roundId: this.round().id });
  }

  handleEventRemove(id: string): void {
    this.onEventRemove.emit({ id, roundId: this.round().id });
  }

  openEditAttendanceDialog(): void {
    const playerIdsWithAtLeastOneRoundEvent = this.round().events.map(event => event.playerId);

    const dialogRef = this.dialog.open(ChoosePlayerDialogComponent, {
      data: {
        title: 'Teilnehmer auswählen',
        showHint: true,
        players: this.activePlayers(),
        selectedIds: this.round().attendees,
        disabledIds: Array.from(new Set([...this.round().finalists, ...playerIdsWithAtLeastOneRoundEvent])),
      }
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      tap(playerIds => this.onAttendanceChange.emit({ roundId: this.round().id, playerIds })),
    ).subscribe();
  }

  removeRound(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Runde löschen`,
        message: `Beim Löschen der Runde werden auch alle dazugehörigen Daten (Ereignisse, Teilnahmen etc.) gelöscht.\n\nBist du sicher, dass du diese Runde löschen möchtest?`,
      }
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      tap(() => this.onRoundRemove.emit(this.round().id)),
    ).subscribe();
  }

}
