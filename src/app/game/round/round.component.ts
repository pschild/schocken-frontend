import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EventDto, PlayerDto, RoundDetailDto } from '../../api/openapi';
import { IsLoadingPipe } from '../../shared/loading/is-loading.pipe';
import { EventsByPlayerIdPipe } from '../../shared/pipes/events-by-player-id.pipe';
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
  disabled = input<boolean>(false);

  onEventAdd = output<{ context: ContextEnum; playerId: string; roundId: string }>();
  onEventRemove = output<{ id: string; roundId: string }>();
  onRoundRemove = output<string>();
  onFinalistsChange = output<{ roundId: string; finalistIds: string[] }>();
  onAttendanceChange = output<string>();

  attendees = computed(() => this.players().filter(player => this.round().attendees.includes(player.id)));

  Context = ContextEnum;

  handleSelectionChange(selectedIds: string[]): void {
    this.onFinalistsChange.emit({ roundId: this.round().id, finalistIds: selectedIds });
  }

  handleEventAdd(payload: { context: ContextEnum; playerId: string }): void {
    this.onEventAdd.emit({ ...payload, roundId: this.round().id });
  }

  handleEventRemove(id: string): void {
    this.onEventRemove.emit({ id, roundId: this.round().id });
  }

  openEditAttendanceDialog(): void {
    this.onAttendanceChange.emit(this.round().id);
  }

  removeRound(): void {
    this.onRoundRemove.emit(this.round().id);
  }

}
