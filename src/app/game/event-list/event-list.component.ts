import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal, untracked } from '@angular/core';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventDetailDto, EventDto, PlayerDto } from '../../api/openapi';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { EventsByPlayerIdPipe } from '../../shared/pipes/events-by-player-id.pipe';
import ContextEnum = EventDto.ContextEnum;

@Component({
  selector: 'hop-event-list',
  standalone: true,
  imports: [
    CommonModule,
    EventsByPlayerIdPipe,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatMiniFabButton,
    MatButton,
    MatTooltipModule,
    PenaltyWithUnitComponent
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent {

  context = input.required<ContextEnum>();
  players = input.required<PlayerDto[]>();
  selectedPlayers = input<string[]>([]);
  events = input.required<EventDetailDto[]>();
  disabled = input<boolean>(false);

  onSelectionChange = output<string[]>();
  onEventAdd = output<{ context: ContextEnum; playerId: string }>();
  onEventRemove = output<string>();

  private selection = signal(this.selectedPlayers());

  Context = ContextEnum;

  constructor() {
    effect(() => {
      untracked(() => this.selection.set(this.selectedPlayers()))
    });
  }

  handleCheckboxChange({ checked }: MatCheckboxChange, playerId: string): void {
    if (checked) {
      this.selection.update(ids => [...ids, playerId]);
    } else {
      this.selection.update(ids => ids.filter(id => id !== playerId));
    }
    this.onSelectionChange.emit(this.selection());
  }

  openAddEventDialog(player: PlayerDto): void {
    this.onEventAdd.emit({ context: this.context(), playerId: player.id });
  }

  removeEvent(id: string): void {
    this.onEventRemove.emit(id);
  }

}
