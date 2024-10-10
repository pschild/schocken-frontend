import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventDto, PlayerDto, RoundDetailDto } from '../../api/openapi';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { EventsByPlayerIdPipe } from '../../shared/pipes/events-by-player-id.pipe';
import { EditAttendanceDialogComponent } from '../edit-attendance-dialog/edit-attendance-dialog.component';
import { EventListComponent } from '../event-list/event-list.component';
import ContextEnum = EventDto.ContextEnum;

@Component({
  selector: 'hop-round',
  standalone: true,
  imports: [CommonModule, EventsByPlayerIdPipe, EventListComponent, MatButton, MatIconModule],
  templateUrl: './round.component.html',
  styleUrl: './round.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundComponent implements OnInit {

  round = input.required<RoundDetailDto>();
  players = input.required<PlayerDto[]>();
  disabled = input<boolean>(false);

  onRoundRemove = output<string>();
  onFinalistsChange = output<{ roundId: string; finalistIds: string[] }>();

  readonly dialog = inject(MatDialog);

  attendees: PlayerDto[] = [];

  Context = ContextEnum;

  ngOnInit(): void {
    this.attendees = this.players().filter(player => this.round().attendees.includes(player.id));
  }

  handleSelectionChange(selectedIds: string[]): void {
    this.onFinalistsChange.emit({ roundId: this.round().id, finalistIds: selectedIds });
  }

  handleEventRemove(id: string): void {
    console.log('remove round event', id);
  }

  openEditAttendanceDialog(): void {
    const dialogRef = this.dialog.open(EditAttendanceDialogComponent, {
      data: {}
    });
    dialogRef.afterClosed().pipe(
      tap(console.log),
    ).subscribe();
  }

  removeRound(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Runde löschen`,
        message: `Bist du sicher, dass du diese Runde löschen möchtest?`,
      }
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      tap(() => this.onRoundRemove.emit(this.round().id)),
    ).subscribe();
  }

}
