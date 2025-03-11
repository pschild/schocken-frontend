import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, untracked } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { EventDetailDto, EventDto, PlayerDto } from '../../api/openapi';
import { HasPermissionDirective } from '../../auth/has-permission.directive';
import { PermissionsService } from '../../auth/permissions.service';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { EventsByPlayerIdPipe } from '../../shared/pipes/events-by-player-id.pipe';
import ContextEnum = EventDto.ContextEnum;
import { Permission } from '../../auth/model/permission.enum';

@Component({
  selector: 'hop-event-list',
  standalone: true,
  imports: [
    CommonModule,
    EventsByPlayerIdPipe,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatTooltipModule,
    PenaltyWithUnitComponent,
    HasPermissionDirective,
    CurrentUserDirective,
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
  Permission = Permission;

  hasUpdatePermission$: Observable<boolean> = inject(PermissionsService).hasPermission(Permission.UPDATE_ROUNDS);

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
