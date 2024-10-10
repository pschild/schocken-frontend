import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, debounceTime, Observable, Subject, switchMap, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  EventDetailDto,
  GameDetailDto,
  GameDetailsService,
  PlayerDto,
  PlayerService,
  RoundDetailDto,
  RoundDetailsService
} from '../api/openapi';
import { StateService } from '../shared/state.service';
import { SuccessMessageService } from '../shared/success-message.service';
import { GameDetailsFormComponent } from './game-details-form/game-details-form.component';

interface IGameState {
  gameDetails: GameDetailDto | null;
  rounds: RoundDetailDto[];
  events: EventDetailDto[];
  players: PlayerDto[];
}

const initialState: IGameState = {
  gameDetails: null,
  rounds: [],
  events: [],
  players: [],
}

@Injectable({
  providedIn: 'root',
})
export class GameState extends StateService<IGameState> {

  readonly dialog = inject(MatDialog);

  private gameDetailsService = inject(GameDetailsService);
  private roundDetailsService = inject(RoundDetailsService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);

  private updateFinalistsDebouncer$ = new Subject<{ roundId: string; finalistIds: string[] }>();

  gameDetails$: Observable<GameDetailDto | null> = this.select(state => state.gameDetails);
  rounds$: Observable<RoundDetailDto[]> = this.select(state => state.rounds);
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

  /**
   * GameEvents
   * - alle Spieler, die aktiv und nicht gelöscht sind
   * - alle Spieler, die mind. 1 GameEvent haben
   *
   * RoundEvents
   * - alle Spieler, die an der jeweiligen Runde teilnehmen
   *
   * Attendance-Dialog
   * - alle Spieler, die aktiv und nicht gelöscht sind
   */

  constructor() {
    super(initialState);

    this.updateFinalistsDebouncer$.pipe(
      debounceTime(500),
      switchMap(({ roundId, finalistIds }) => this.roundDetailsService.updateFinalists(roundId, { playerIds: finalistIds }).pipe(
        tap((updatedRound: RoundDetailDto) => this.setState({ rounds: this.state.rounds.map(round => round.id === roundId ? updatedRound : round) }))
      )),
      tap(() => this.successMessageService.showSuccess(`Finalisten aktualisiert`)),
    ).subscribe();
  }

  init(gameId: string): void {
    this.gameDetailsService.getDetails(gameId).subscribe(gameDetails => this.setState({ gameDetails }));
    this.roundDetailsService.getByGameId(gameId).subscribe(rounds => this.setState({ rounds }));
    this.playerService.findAll().subscribe(players => this.setState({ players }));
  }

  openGameDetailsDialog(): void {
    this.dialog.open(GameDetailsFormComponent, {
      minWidth: 500,
      height: '350px',
      data: {
        gameDetails: this.state.gameDetails,
        players: this.state.players,
      }
    }).afterClosed().pipe(
      filter(result => !!result),
      switchMap(({ type, hostedById, placeOfAwayGame, excludeFromStatistics }) => this.gameDetailsService.update(this.state.gameDetails!.id, { placeType: type, hostedById, placeOfAwayGame, excludeFromStatistics })),
      tap((updatedGame: GameDetailDto) => this.setState({ gameDetails: updatedGame })),
      tap(() => this.successMessageService.showSuccess(`Spiel aktualisiert`)),
    ).subscribe();
  }

  updateFinalists(payload: { roundId: string; finalistIds: string[] }): void {
    this.updateFinalistsDebouncer$.next(payload);
  }

}
