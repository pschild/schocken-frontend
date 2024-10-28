import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { compareAsc } from 'date-fns';
import { combineLatest, concat, defaultIfEmpty, defer, Observable, of, switchMap, tap, throwError, toArray } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  CreateDetailEventResponse,
  CreateDetailRoundResponse,
  EventDetailsService,
  EventDto,
  EventTypeDto,
  EventTypeOverviewDto,
  EventTypeService,
  GameDetailDto,
  GameDetailsService,
  PlayerDto,
  PlayerService,
  RoundDetailDto,
  RoundDetailsService,
  UpdateGameDto
} from '../api/openapi';
import { InfoDialogComponent } from '../dialog/info-dialog/info-dialog.component';
import { LoadingState } from '../shared/loading/loading.state';
import { doWithLoading } from '../shared/operators';
import { StateService } from '../shared/state.service';
import { SuccessMessageService } from '../shared/success-message.service';
import { AddEventModel } from './add-event-dialog/add-event-form/add-event-form.component';
import { CelebrationDialogComponent } from './celebration-dialog/celebration-dialog.component';
import { EditAttendanceDialogComponent } from './edit-attendance-dialog/edit-attendance-dialog.component';
import ContextEnum = EventDto.ContextEnum;
import TriggerEnum = EventTypeDto.TriggerEnum;

interface IGameState {
  gameDetails: GameDetailDto | null;
  rounds: RoundDetailDto[];
  players: PlayerDto[];
  eventTypes: EventTypeOverviewDto[];
}

const initialState: IGameState = {
  gameDetails: null,
  rounds: [],
  players: [],
  eventTypes: [],
}

@Injectable({
  providedIn: 'root',
})
export class GameState extends StateService<IGameState> {

  readonly dialog = inject(MatDialog);

  private gameDetailsService = inject(GameDetailsService);
  private roundDetailsService = inject(RoundDetailsService);
  private eventDetailsService = inject(EventDetailsService);
  private eventTypeService = inject(EventTypeService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);
  private loadingState = inject(LoadingState);

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
    this.gameDetailsService.getDetails(gameId).pipe(doWithLoading(this.loadingState, 'game-details')).subscribe(gameDetails => this.setState({ gameDetails }));
    this.roundDetailsService.getByGameId(gameId).subscribe(rounds => this.setState({ rounds }));
    this.playerService.findAll().subscribe(players => this.setState({ players }));
    this.eventTypeService.findAll().subscribe(eventTypes => this.setState({ eventTypes }));
  }

  updateGame(gameId: string, dto: UpdateGameDto): Observable<GameDetailDto> {
    return this.gameDetailsService.update(gameId, dto).pipe(
      doWithLoading(this.loadingState, 'game-details'),
      tap((gameDetails: GameDetailDto) => this.setState({ gameDetails })),
      tap(() => this.successMessageService.showSuccess(`Spiel aktualisiert`)),
    );
  }

  addEvent(context: ContextEnum, playerId: string, event: AddEventModel, roundId?: string): Observable<unknown[]> {
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
      comment: event.comment,
      playerId,
      ...(context === ContextEnum.Game ? { gameId: this.state.gameDetails!.id } : { roundId }),
    }).pipe(
      switchMap(response => {
        if (event.trigger === TriggerEnum.SchockAus && roundId) {
          const round = this.state.rounds.find(round => round.id === roundId);
          const attendeeIds = round?.attendees || [];
          const finalistIds = round?.finalists || [];
          const hasFinal = finalistIds?.length > 0;
          const schockAusStrafeEventType = this.state.eventTypes.find(type => type.trigger === TriggerEnum.SchockAusPenalty);
          if (!schockAusStrafeEventType) {
            throw new Error(`Invalid arguments: Missing event for "Schock Aus-Strafe"`);
          }

          return this.dialog.open(EditAttendanceDialogComponent, {
            data: {
              players: hasFinal ? this.state.players.filter(p => finalistIds.includes(p.id)) : this.state.players.filter(p => attendeeIds.includes(p.id)),
              selectedIds: hasFinal ? finalistIds.filter(id => id !== playerId) : attendeeIds.filter(id => id !== playerId),
              disabledIds: [playerId],
            }
          }).afterClosed().pipe(
            filter(result => !!result),
            switchMap((playerIds: string[]) => this.eventDetailsService.createMany({ eventTypeId: schockAusStrafeEventType.id, context: ContextEnum.Round, roundId, playerIds })),
            map(responses => [response, ...responses]),
            defaultIfEmpty([]),
          );
        }
        return of([response]);
      }),
      switchMap((responses: CreateDetailEventResponse[]) => {
        if (context === ContextEnum.Game) {
          return this.gameDetailsService.getDetails(this.state.gameDetails!.id).pipe(
            tap(gameDetails => this.setState({ gameDetails })),
            map(() => responses),
          );
        } else if (context === ContextEnum.Round) {
          return this.roundDetailsService.getDetails(roundId!).pipe(
            tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
            map(() => responses),
          );
        } else {
          return throwError(() => new Error(`Invalid argument: context was ${context}`));
        }
      }),
      doWithLoading(this.loadingState, roundId ? roundId : 'game-events'),
      tap(() => this.successMessageService.showSuccess(`Ereignis hinzugefügt`)),
      switchMap((responses: CreateDetailEventResponse[]) => {
        const celebrationDialogs$ = responses.filter(r => !!r.celebration).map(r => defer(() => this.dialog.open(CelebrationDialogComponent, { data: { celebration: r.celebration } }).afterClosed()));
        const warningDialogs$ = responses.filter(r => !!r.warning).map(r => defer(() => this.dialog.open(InfoDialogComponent, { data: { title: 'Hinweis', message: r.warning } }).afterClosed()));
        return concat(...warningDialogs$, ...celebrationDialogs$).pipe(toArray());
      }),
    );
  }

  removeEvent(context: ContextEnum, id: string, roundId?: string): Observable<GameDetailDto | RoundDetailDto> {
    return this.eventDetailsService.remove(id).pipe(
      doWithLoading(this.loadingState, roundId ? roundId : 'game-events'),
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
      doWithLoading(this.loadingState, roundId),
      tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
      tap(() => this.successMessageService.showSuccess(`Finalisten aktualisiert`)),
    );
  }

  updateAttendance({ roundId, playerIds }: { roundId: string; playerIds: string[] }): Observable<RoundDetailDto> {
    return this.roundDetailsService.updateAttendees(roundId, {playerIds}).pipe(
      doWithLoading(this.loadingState, roundId),
      tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
      tap(() => this.successMessageService.showSuccess(`Teilnahmen aktualisiert`)),
    );
  }

  removeRound(id: string): Observable<string> {
    return this.roundDetailsService.remove(id).pipe(
      doWithLoading(this.loadingState, `remove-round-${id}`),
      tap(id => this.setState({ rounds: this.state.rounds.filter(round => round.id !== id) })),
      tap(() => this.successMessageService.showSuccess(`Runde gelöscht`)),
    );
  }

  startNewRound(): Observable<CreateDetailRoundResponse> {
    return this.roundDetailsService.create({ gameId: this.state.gameDetails!.id }).pipe(
      doWithLoading(this.loadingState, 'start-new-round'),
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
      doWithLoading(this.loadingState, 'complete-game'),
      tap(gameDetails => this.setState({ gameDetails })),
      tap(() => this.successMessageService.showSuccess(`Spiel aktualisiert`)),
    );
  }
}
