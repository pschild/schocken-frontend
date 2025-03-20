import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CelebrationDto, EventTypeOverviewDto, GameDetailDto, PlayerDto, RoundDetailDto, UpdateGameDto } from '../api/openapi';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog/confirmation-dialog.component';
import { InfoDialogComponent } from '../dialog/info-dialog/info-dialog.component';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { AddEventModel } from './add-event-dialog/add-event-form/add-event-form.component';
import { CelebrationDialogComponent } from './celebration-dialog/celebration-dialog.component';
import { ChoosePlayerDialogComponent } from './choose-player-dialog/choose-player-dialog.component';
import { GameDetailsFormComponent } from './game-details-form/game-details-form.component';
import {
  getActivePlayers,
  playerIdsNotRemovableFromAttendees,
  possiblePlayersForSchockAusStrafe,
  selectedPlayerIdsForSchockAusStrafe
} from './game-state.utils';
import { HandleVerlorenEventDialogComponent } from './handle-verloren-event-dialog/handle-verloren-event-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GameDialogService {

  private dialog = inject(MatDialog);

  updateGameDialog(gameDetails: GameDetailDto | null, players: PlayerDto[]): Observable<UpdateGameDto> {
    return this.dialog.open(GameDetailsFormComponent, {
      data: {
        gameDetails,
        players,
      }
    }).afterClosed().pipe(
      filter(result => !!result),
    );
  }

  removeGameDialog(): Observable<boolean> {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Spiel löschen`,
        message: `Beim Löschen des Spiels werden auch alle dazugehörigen Daten (Runden, Ereignisse, Teilnahmen etc.) gelöscht.\n\nBist du sicher, dass du dieses Spiel löschen möchtest?`,
      }
    }).afterClosed().pipe(
      filter(result => !!result),
    );
  }

  addEventDialog(eventTypes: EventTypeOverviewDto[]): Observable<AddEventModel> {
    return this.dialog.open(AddEventDialogComponent, {
      width: '90vw',
      data: { eventTypes }
    }).afterClosed().pipe(
      filter(result => !!result),
    );
  }

  schockAusStrafeDialog(round: RoundDetailDto, players: PlayerDto[], playerIdWithSchockAus: string): Observable<string[]> {
    return this.dialog.open(ChoosePlayerDialogComponent, {
      data: {
        title: 'Schock-Aus-Strafen verteilen',
        players: possiblePlayersForSchockAusStrafe(round, players),
        selectedIds: selectedPlayerIdsForSchockAusStrafe(round, playerIdWithSchockAus),
        disabledIds: [playerIdWithSchockAus],
      }
    }).afterClosed().pipe(
      filter(result => !!result),
    );
  }

  verlorenDialog(playerName: string): Observable<boolean> {
    return this.dialog.open(HandleVerlorenEventDialogComponent, {
      data: { playerName }
    }).afterClosed().pipe(
      filter(result => !!result),
    );
  }

  celebrationDialog(celebration: CelebrationDto): Observable<unknown> {
    return this.dialog.open(CelebrationDialogComponent, {
      data: { celebration }
    }).afterClosed();
  }

  warningDialog(message: string): Observable<boolean> {
    return this.dialog.open(InfoDialogComponent, {
      data: {
        title: 'Hinweis',
        message,
      }
    }).afterClosed();
  }

  removeEventDialog(): Observable<boolean> {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Ereignis löschen`,
        message: `Bist du sicher, dass du dieses Ereignis löschen möchtest?`,
      }
    }).afterClosed().pipe(
      filter(result => !!result),
    );
  }

  updateAttendanceDialog(round: RoundDetailDto, players: PlayerDto[]): Observable<string[]> {
    return this.dialog.open(ChoosePlayerDialogComponent, {
      data: {
        title: 'Teilnehmer auswählen',
        showHint: true,
        players: getActivePlayers(players),
        selectedIds: round.attendees,
        disabledIds: playerIdsNotRemovableFromAttendees(round),
      }
    }).afterClosed().pipe(
      filter(result => !!result),
    );
  }

  removeRoundDialog(): Observable<boolean> {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Runde löschen`,
        message: `Beim Löschen der Runde werden auch alle dazugehörigen Daten (Ereignisse, Teilnahmen etc.) gelöscht.\n\nBist du sicher, dass du diese Runde löschen möchtest?`,
      }
    }).afterClosed().pipe(
      filter(result => !!result),
    );
  }

  warningBeforeCompleteDialog(warningCount: number): Observable<boolean> {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Achtung',
        message: `Es gibt noch ${warningCount} Warnung(en). Soll das Spiel trotzdem abgeschlossen werden?` }
    }).afterClosed().pipe(
      filter(result => !!result)
    );
  }

}
