import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { compareAsc } from 'date-fns';
import { combineLatest, Observable, switchMap, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateDetailRoundResponse,
  EventDetailsService,
  EventDto,
  GameDetailDto,
  GameDetailsService,
  PlayerDto,
  PlayerService,
  RoundDetailDto,
  RoundDetailsService,
  UpdateGameDto
} from '../api/openapi';
import { InfoDialogComponent } from '../dialog/info-dialog/info-dialog.component';
import { StateService } from '../shared/state.service';
import { SuccessMessageService } from '../shared/success-message.service';
import { AddEventModel } from './add-event-dialog/add-event-form/add-event-form.component';
import { CelebrationDialogComponent } from './celebration-dialog/celebration-dialog.component';
import ContextEnum = EventDto.ContextEnum;

interface IGameState {
  gameDetails: GameDetailDto | null;
  rounds: RoundDetailDto[];
  players: PlayerDto[];
}

const initialState: IGameState = {
  gameDetails: null,
  rounds: [],
  players: [],
}

@Injectable({
  providedIn: 'root',
})
export class GameState extends StateService<IGameState> {

  readonly dialog = inject(MatDialog);

  private gameDetailsService = inject(GameDetailsService);
  private roundDetailsService = inject(RoundDetailsService);
  private eventDetailsService = inject(EventDetailsService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);

  gameDetails$: Observable<GameDetailDto | null> = this.select(state => state.gameDetails);
  rounds$: Observable<RoundDetailDto[]> = this.select(state => state.rounds.sort((a, b) => compareAsc(a.datetime, b.datetime)));
  players$: Observable<PlayerDto[]> = this.select(state => state.players);
  activePlayers$: Observable<PlayerDto[]> = this.players$.pipe(map(players => players.filter(player => player.active && !player.isDeleted)));
  playerIdsWithGameEvent$: Observable<Set<string>> = this.gameDetails$.pipe(map(game => new Set<string>(game?.events.map(event => event.playerId) || [])));
  playersForGameEvents$: Observable<PlayerDto[]> = combineLatest([this.players$, this.activePlayers$, this.playerIdsWithGameEvent$]).pipe(
    map(([players, activePlayers, playerIdsWithGameEvent]) => {
      const activePlayerIds = activePlayers.map(player => player.id);
      const result = new Set<string>([...activePlayerIds, ...playerIdsWithGameEvent]);
      return players.filter(player => result.has(player.id));
    }),
  );

  constructor() {
    super(initialState);
  }

  init(gameId: string): void {
    this.gameDetailsService.getDetails(gameId).subscribe(gameDetails => this.setState({ gameDetails }));
    this.roundDetailsService.getByGameId(gameId).subscribe(rounds => this.setState({ rounds }));
    this.playerService.findAll().subscribe(players => this.setState({ players }));
  }

  updateGame(gameId: string, dto: UpdateGameDto): Observable<GameDetailDto> {
    return this.gameDetailsService.update(gameId, dto).pipe(
      tap(gameDetails => this.setState({ gameDetails })),
      tap(() => this.successMessageService.showSuccess(`Spiel aktualisiert`)),
    );
  }

  addEvent(context: ContextEnum, playerId: string, event: AddEventModel, roundId?: string): Observable<GameDetailDto | RoundDetailDto> {
    if (context === ContextEnum.Game && !this.state.gameDetails?.id) {
      throw new Error(`Invalid arguments: Missing gameId`);
    }
    if (context === ContextEnum.Round && !roundId) {
      throw new Error(`Invalid arguments: Missing roundId`);
    }

    return this.eventDetailsService.create({
      context,
      eventTypeId: event.id,
      multiplicatorValue: event.multiplicatorValue,
      playerId,
      ...(context === ContextEnum.Game ? { gameId: this.state.gameDetails!.id } : { roundId }),
    }).pipe(
      tap(response => {
        if (response.celebration) {
          this.dialog.open(CelebrationDialogComponent, { data: { celebration: response.celebration } });
        }
      }),
      switchMap(() => {
        if (context === ContextEnum.Game) {
          return this.gameDetailsService.getDetails(this.state.gameDetails!.id).pipe(
            tap(gameDetails => this.setState({ gameDetails })),
          );
        } else if (context === ContextEnum.Round) {
          return this.roundDetailsService.getDetails(roundId!).pipe(
            tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
          );
        } else {
          return throwError(() => new Error(`Invalid argument: context was ${context}`));
        }
      }),
      tap(() => this.successMessageService.showSuccess(`Ereignis hinzugefügt`)),
    );
  }

  removeEvent(context: ContextEnum, id: string, roundId?: string): Observable<GameDetailDto | RoundDetailDto> {
    return this.eventDetailsService.remove(id).pipe(
      switchMap(() => {
        if (context === ContextEnum.Game) {
          return this.gameDetailsService.getDetails(this.state.gameDetails!.id).pipe(
            tap(gameDetails => this.setState({ gameDetails })),
          );
        } else if (context === ContextEnum.Round) {
          return this.roundDetailsService.getDetails(roundId!).pipe(
            tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
          );
        } else {
          return throwError(() => new Error(`Invalid argument: context was ${context}`));
        }
      }),
      tap(() => this.successMessageService.showSuccess(`Ereignis gelöscht`)),
    );
  }

  updateFinalists({ roundId, finalistIds }: { roundId: string; finalistIds: string[] }): Observable<RoundDetailDto> {
    return this.roundDetailsService.updateFinalists(roundId, { playerIds: finalistIds }).pipe(
      tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
      tap(() => this.successMessageService.showSuccess(`Finalisten aktualisiert`)),
    );
  }

  updateAttendance({ roundId, playerIds }: { roundId: string; playerIds: string[] }): Observable<RoundDetailDto> {
    return this.roundDetailsService.updateAttendees(roundId, {playerIds}).pipe(
      tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
      tap(() => this.successMessageService.showSuccess(`Teilnahmen aktualisiert`)),
    );
  }

  removeRound(id: string): Observable<string> {
    return this.roundDetailsService.remove(id).pipe(
      tap(id => this.setState({ rounds: this.state.rounds.filter(round => round.id !== id) })),
      tap(() => this.successMessageService.showSuccess(`Runde gelöscht`)),
    );
  }

  startNewRound(): Observable<CreateDetailRoundResponse> {
    return this.roundDetailsService.create({ gameId: this.state.gameDetails!.id }).pipe(
      tap(response => {
        if (response.celebration) {
          this.dialog.open(CelebrationDialogComponent, { data: { celebration: response.celebration } });
        }
      }),
      tap(response => this.setState({ rounds: [...this.state.rounds, response.round] })),
      tap(() => this.successMessageService.showSuccess(`Neue Runde erstellt`)),
    );
  }

  setGameCompleted(completed: boolean): Observable<GameDetailDto> {
    return this.gameDetailsService.update(this.state.gameDetails!.id, { completed }).pipe(
      tap(gameDetails => this.setState({ gameDetails })),
      tap(() => this.successMessageService.showSuccess(`Spiel aktualisiert`)),
    );
  }
}
