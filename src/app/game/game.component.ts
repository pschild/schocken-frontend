import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import confetti from 'canvas-confetti';
import { debounceTime, delay, Observable, Subject, switchMap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CreateGameDto, EventDto, GameDetailDto, PlayerDto, RoundDetailDto } from '../api/openapi';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { LoadingMaskComponent } from '../shared/loading/loading-mask/loading-mask.component';
import { PenaltyWithUnitComponent } from '../shared/penalty-with-unit/penalty-with-unit.component';
import { PlaceTypeToLabelPipe } from '../shared/pipes/place-type-to-label.pipe';
import { AddEventModel } from './add-event-dialog/add-event-form/add-event-form.component';
import { EventListComponent } from './event-list/event-list.component';
import { GameDetailsFormComponent } from './game-details-form/game-details-form.component';
import { GameState } from './game.state';
import { RoundComponent } from './round/round.component';
import PlaceTypeEnum = CreateGameDto.PlaceTypeEnum;
import ContextEnum = EventDto.ContextEnum;

@Component({
  selector: 'hop-game',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatBadgeModule,
    PlaceTypeToLabelPipe,
    PenaltyWithUnitComponent,
    RoundComponent,
    EventListComponent,
    MatProgressSpinner,
    IsLoadingPipe,
    LoadingMaskComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {

  @ViewChild('stepper') private stepper!: MatStepper;

  readonly dialog = inject(MatDialog);
  readonly destroyRef = inject(DestroyRef);

  PlaceTypeEnum = PlaceTypeEnum;
  Context = ContextEnum;

  private state = inject(GameState);
  private route = inject(ActivatedRoute);

  gameDetails$: Observable<GameDetailDto | null> = this.state.gameDetails$;
  rounds$: Observable<RoundDetailDto[]> = this.state.rounds$;
  players$: Observable<PlayerDto[]> = this.state.players$;
  activePlayers$: Observable<PlayerDto[]> = this.state.activePlayers$;
  playersForGameEvents$: Observable<PlayerDto[]> = this.state.playersForGameEvents$;

  private updateFinalistsDebouncer$ = new Subject<{ roundId: string; finalistIds: string[] }>();

  ngOnInit() {
    this.updateFinalistsDebouncer$.pipe(
      debounceTime(750),
      switchMap(payload => this.state.updateFinalists(payload)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ id }) => this.state.init(id));
  }

  openGameDetailsDialog(): void {
    const gameSnapshot = this.state.selectSnapshot(state => state.gameDetails);
    const playersSnapshot = this.state.selectSnapshot(state => state.players);

    this.dialog.open(GameDetailsFormComponent, {
      minWidth: 500,
      height: 'auto',
      data: {
        gameDetails: gameSnapshot,
        players: playersSnapshot,
      }
    }).afterClosed().pipe(
      filter(result => !!result),
      switchMap(dto => this.state.updateGame(gameSnapshot!.id, dto)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleGameEventAdd({ context, playerId, event }: { context: ContextEnum; playerId: string; event: AddEventModel }): void {
    this.state.addEvent(context, playerId, event).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleRoundEventAdd({ context, playerId, event, roundId }: { context: ContextEnum; playerId: string; event: AddEventModel; roundId: string }): void {
    this.state.addEvent(context, playerId, event, roundId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleGameEventRemove(id: string): void {
    this.state.removeEvent(ContextEnum.Game, id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleRoundEventRemove({ id, roundId }: { id: string; roundId: string }): void {
    this.state.removeEvent(ContextEnum.Round, id, roundId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleFinalistsChange(payload: { roundId: string; finalistIds: string[] }): void {
    this.updateFinalistsDebouncer$.next(payload);
  }

  handleAttendanceChange(payload: { roundId: string; playerIds: string[] }): void {
    this.state.updateAttendance(payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleRoundRemove(id: string): void {
    this.state.removeRound(id).pipe(
      delay(1), // wait for stepper being updated before activating the last step
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.openLastRound());
  }

  startNewRound(): void {
    this.state.startNewRound().pipe(
      delay(1), // wait for stepper being updated before activating the last step
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.openLastRound());
  }

  private openLastRound(): void {
    this.stepper.selectedIndex = this.stepper.steps.length - 1;
  }

  setGameCompleted(e: MouseEvent): void {
    confetti({
      shapes: ['circle'],
      particleCount: 200,
      startVelocity: 30,
      spread: 120,
      origin: {
        x: e.x / window.innerWidth,
        y: e.y / window.innerHeight
      }
    });

    this.state.setGameCompleted(true).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
