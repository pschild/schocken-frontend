import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { compareAsc } from 'date-fns';
import { concat, defaultIfEmpty, defer, EMPTY, Observable, of, Subject, switchMap, tap, throwError, toArray } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CelebrationDto,
  CreateDetailRoundResponse,
  EventDetailsService,
  EventDto,
  EventTypeDto,
  EventTypeOverviewDto,
  EventTypeOverviewService,
  EventTypeService,
  GameDetailDto,
  GameDetailsService,
  PlayerDto,
  PlayerService,
  RoundDetailDto,
  RoundDetailsService,
} from '../api/openapi';
import { InvalidArgumentError } from '../error/invalid-argument.error';
import { LoadingState } from '../shared/loading/loading.state';
import { doWithLoading } from '../shared/operators';
import { StateService } from '../shared/state.service';
import { SuccessMessageService } from '../shared/success-message.service';
import { AddEventModel } from './add-event-dialog/add-event-form/add-event-form.component';
import { GameDialogService } from './game-dialog.service';
import {
  countWarnings,
  findEventTypeByTrigger,
  findPlayerNameById,
  findRoundById,
  playersForGameEvents,
  validateArguments
} from './game-state.utils';
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

  private router = inject(Router);
  private gameDetailsService = inject(GameDetailsService);
  private roundDetailsService = inject(RoundDetailsService);
  private eventDetailsService = inject(EventDetailsService);
  private eventTypeService = inject(EventTypeService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);
  private eventTypeOverviewService = inject(EventTypeOverviewService);
  private gameDialogService = inject(GameDialogService);
  private loadingState = inject(LoadingState);

  gameDetails$: Observable<GameDetailDto | null> = this.select(state => state.gameDetails);
  rounds$: Observable<RoundDetailDto[]> = this.select(state => state.rounds.sort((a, b) => compareAsc(a.datetime, b.datetime)));
  players$: Observable<PlayerDto[]> = this.select(state => state.players);
  playersForGameEvents$: Observable<PlayerDto[]> = this.select(state => playersForGameEvents(state.gameDetails, state.players));
  warnings$: Observable<number> = this.rounds$.pipe(map(rounds => countWarnings(rounds)));

  openLastRound$ = new Subject<void>();

  constructor() {
    super(initialState);
  }

  init(gameId: string): void {
    this.gameDetailsService.findOne(gameId).subscribe(gameDetails => this.setState({ gameDetails }));
    this.roundDetailsService.getByGameId(gameId).subscribe(rounds => this.setState({ rounds }));
    this.playerService.findAll().subscribe(players => this.setState({ players }));
    this.eventTypeService.findAll().subscribe(eventTypes => this.setState({ eventTypes }));
  }

  reset(): void {
    this.setState(initialState);
  }

  updateGame(): Observable<GameDetailDto> {
    return this.gameDialogService.updateGameDialog(this.state.gameDetails, this.state.players).pipe(
      switchMap(dto => this.gameDetailsService.update(this.state.gameDetails!.id, dto).pipe(
        doWithLoading(this.loadingState, 'game-details'),
        tap((gameDetails: GameDetailDto) => this.setState({ gameDetails })),
        tap(() => this.successMessageService.showSuccess(`Spiel aktualisiert`)),
      )),
    );
  }

  removeGame(): Observable<any> {
    return this.gameDialogService.removeGameDialog().pipe(
      switchMap(() => this.gameDetailsService.remove(this.state.gameDetails!.id).pipe(
        doWithLoading(this.loadingState, 'remove-game'),
        tap(game => this.router.navigate(['home'])),
        tap(() => this.successMessageService.showSuccess(`Spiel gelöscht`)),
      )),
    );
  }

  addEvent(context: ContextEnum, playerId: string, roundId?: string): Observable<unknown[]> {
    validateArguments(context, this.state.gameDetails?.id, roundId);

    return this.eventTypeOverviewService.getOverview(context).pipe(
      switchMap(eventTypes => this.gameDialogService.addEventDialog(eventTypes)),
      switchMap(event => this.eventDetailsService.create({
        context,
        eventTypeId: event.id,
        multiplicatorValue: event.multiplicatorValue,
        comment: event.comment,
        playerId,
        ...(context === ContextEnum.Game ? { gameId: this.state.gameDetails!.id } : { roundId }),
      }).pipe(
        switchMap(response => {
          return this.handleSpecialEvent(playerId, event, roundId).pipe(
            map(responses => [response, ...responses]),
            defaultIfEmpty([response]),
          );
        }),
        switchMap((responses: { celebration?: CelebrationDto; warning?: string; }[]) => {
          return this.reloadGameOrRound(context, roundId).pipe(
            map(() => responses)
          )
        }),
        doWithLoading(this.loadingState, roundId ? roundId : 'game-events'),
        tap(() => this.successMessageService.showSuccess(`Ereignis hinzugefügt`)),
        switchMap((responses: { celebration?: CelebrationDto; warning?: string; }[]) => {
          const celebrationDialogs$ = responses
            .filter(({ celebration }) => !!celebration)
            .map(({ celebration }) => defer(() => this.gameDialogService.celebrationDialog(celebration!)));
          const warningDialogs$ = responses
            .filter(({ warning }) => !!warning)
            .map(({ warning }) => defer(() => this.gameDialogService.warningDialog(warning!)));
          return concat(...warningDialogs$, ...celebrationDialogs$).pipe(toArray());
        }),
      ))
    );
  }

  private handleSpecialEvent(playerId: string, event: AddEventModel, roundId?: string): Observable<{ celebration?: CelebrationDto; warning?: string; }[]> {
    if (event.trigger === TriggerEnum.SchockAus && roundId) {
      const round = findRoundById(this.state.rounds, roundId);
      return this.gameDialogService.schockAusStrafeDialog(round, this.state.players, playerId).pipe(
        switchMap((playerIds: string[]) => {
          const schockAusStrafeEventType = findEventTypeByTrigger(this.state.eventTypes, TriggerEnum.SchockAusPenalty);
          return this.eventDetailsService.createMany({eventTypeId: schockAusStrafeEventType.id, context: ContextEnum.Round, roundId, playerIds})
        }),
      );
    } else if (event.trigger === TriggerEnum.StartNewRound) {
      return this.gameDialogService.verlorenDialog(findPlayerNameById(this.state.players, playerId)).pipe(
        switchMap(result => result ? this.startNewRound().pipe(map(res => [{ celebration: res.celebration }])) : EMPTY),
      );
    }
    return EMPTY;
  }

  removeEvent(context: ContextEnum, id: string, roundId?: string): Observable<GameDetailDto | RoundDetailDto> {
    return this.gameDialogService.removeEventDialog().pipe(
      switchMap(() => this.eventDetailsService.remove(id).pipe(
        doWithLoading(this.loadingState, roundId ? roundId : 'game-events'),
        switchMap(() => this.reloadGameOrRound(context, roundId)),
        tap(() => this.successMessageService.showSuccess(`Ereignis gelöscht`)),
      )),
    );
  }

  private reloadGameOrRound(context: ContextEnum, roundId?: string): Observable<GameDetailDto | RoundDetailDto> {
    if (context === ContextEnum.Game) {
      return this.gameDetailsService.findOne(this.state.gameDetails!.id).pipe(
        tap((gameDetails: GameDetailDto) => this.setState({ gameDetails })),
      );
    } else if (context === ContextEnum.Round) {
      return this.roundDetailsService.getDetails(roundId!).pipe(
        tap((updatedRound: RoundDetailDto) => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
      );
    } else {
      return throwError(() => new InvalidArgumentError(`Invalid context "${context}"`));
    }
  }

  updateFinalists({ roundId, finalistIds }: { roundId: string; finalistIds: string[] }): Observable<RoundDetailDto> {
    return this.roundDetailsService.updateFinalists(roundId, { playerIds: finalistIds }).pipe(
      doWithLoading(this.loadingState, roundId),
      tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
      tap(() => this.successMessageService.showSuccess(`Finalisten aktualisiert`)),
    );
  }

  updateAttendance(roundId: string): Observable<RoundDetailDto> {
    const round = findRoundById(this.state.rounds, roundId);
    return this.gameDialogService.updateAttendanceDialog(round, this.state.players).pipe(
      switchMap(playerIds => this.roundDetailsService.updateAttendees(roundId, {playerIds}).pipe(
        doWithLoading(this.loadingState, roundId),
        tap(updatedRound => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) })),
        tap(() => this.successMessageService.showSuccess(`Teilnahmen aktualisiert`)),
      )),
    );
  }

  removeRound(id: string): Observable<string> {
    return this.gameDialogService.removeRoundDialog().pipe(
      switchMap(() => this.roundDetailsService.remove(id).pipe(
        doWithLoading(this.loadingState, `remove-round-${id}`),
        tap(id => this.setState({ rounds: this.state.rounds.filter(round => round.id !== id) })),
        tap(() => this.openLastRound$.next()),
        tap(() => this.successMessageService.showSuccess(`Runde gelöscht`)),
      )),
    );
  }

  startNewRound(): Observable<CreateDetailRoundResponse> {
    return this.roundDetailsService.create({ gameId: this.state.gameDetails!.id }).pipe(
      doWithLoading(this.loadingState, 'start-new-round'),
      tap(response => this.setState({ rounds: [...this.state.rounds, response.round] })),
      tap(() => this.openLastRound$.next()),
      tap(() => this.successMessageService.showSuccess(`Neue Runde erstellt`)),
    );
  }

  setGameCompleted(completed: boolean): Observable<GameDetailDto> {
    const warningCount = countWarnings(this.state.rounds);
    const confirmation$ = warningCount > 0
      ? this.gameDialogService.warningBeforeCompleteDialog(warningCount)
      : of(true);

    return confirmation$.pipe(
      switchMap(() => this.gameDetailsService.update(this.state.gameDetails!.id, { completed })),
      doWithLoading(this.loadingState, 'complete-game'),
      tap(gameDetails => this.setState({ gameDetails })),
      tap(() => this.successMessageService.showSuccess(`Spiel aktualisiert`)),
    );
  }
}
