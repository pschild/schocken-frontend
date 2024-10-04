import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, switchMap, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  EventDetailDto,
  EventDetailsService, EventDto,
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
import ContextEnum = EventDto.ContextEnum;

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
  private eventDetailsService = inject(EventDetailsService);
  private roundDetailsService = inject(RoundDetailsService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);

  gameDetails$: Observable<GameDetailDto | null> = this.select(state => state.gameDetails);
  rounds$: Observable<RoundDetailDto[]> = this.select(state => state.rounds);
  gameEvents$: Observable<EventDetailDto[]> = this.select(state => state.events.filter(event => event.context === ContextEnum.Game));
  roundEvents$: Observable<EventDetailDto[]> = this.select(state => state.events.filter(event => event.context === ContextEnum.Round));
  roundEventsByRound$ = (roundId: string) => this.roundEvents$.pipe(
    map(events => events.filter(event => event.roundId === roundId)),
  );
  roundsWithEvents$: Observable<(RoundDetailDto & { events: EventDetailDto[] })[]> = this.select(state => state.rounds.map(round => ({
    ...round,
    events: state.events.filter(event => event.roundId === round.id),
  })));
  players$: Observable<PlayerDto[]> = this.select(state => state.players);

  constructor() {
    super(initialState);
  }

  init(gameId: string): void {
    this.gameDetailsService.getDetails(gameId).subscribe(gameDetails => this.setState({ gameDetails }));
    this.roundDetailsService.getByGameId(gameId).subscribe(rounds => this.setState({ rounds }));
    this.eventDetailsService.findAllByGameId(gameId).subscribe(events => this.setState({ events }));
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

}
