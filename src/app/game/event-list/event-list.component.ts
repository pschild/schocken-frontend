import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, untracked } from '@angular/core';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventDetailDto, EventDto, PlayerDto } from '../../api/openapi';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { EventsByPlayerIdPipe } from '../../shared/pipes/events-by-player-id.pipe';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
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
  onEventRemove = output<string>();

  private selection = signal(this.selectedPlayers());

  readonly dialog = inject(MatDialog);

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
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: {
        player
      }
    });
    dialogRef.afterClosed().pipe(
      tap(console.log),
    ).subscribe();
  }

  removeEvent(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Ereignis löschen`,
        message: `Bist du sicher, dass du dieses Ereignis löschen möchtest?`,
      }
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      tap(() => this.onEventRemove.emit(id)),
    ).subscribe();
  }

}
