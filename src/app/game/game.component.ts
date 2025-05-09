import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, delay, Observable, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  CreateGameDto,
  EventDto,
  GameDetailDto, LiveGameStatisticsResponseDto,
  PlayerDto,
  RoundDetailDto
} from '../api/openapi';
import { HasAllPermissionsDirective } from '../auth/has-all-permissions.directive';
import { HasPermissionDirective } from '../auth/has-permission.directive';
import { Permission } from '../auth/model/permission.enum';
import { LiveIndicatorComponent } from '../live-indicator/live-indicator.component';
import { ButtonSpinnerDirective } from '../shared/button-spinner.directive';
import { CelebrationDirective } from '../shared/celebration.directive';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { LoadingMaskComponent } from '../shared/loading/loading-mask/loading-mask.component';
import { PenaltyWithUnitComponent } from '../shared/penalty-with-unit/penalty-with-unit.component';
import { PlaceTypeToLabelPipe } from '../shared/pipes/place-type-to-label.pipe';
import { CelebrationDialogComponent } from './celebration-dialog/celebration-dialog.component';
import { EventListComponent } from './event-list/event-list.component';
import { GameState } from './game.state';
import { RoundComponent } from './round/round.component';
import PlaceTypeEnum = CreateGameDto.PlaceTypeEnum;
import ContextEnum = EventDto.ContextEnum;
import { MatExpansionModule } from '@angular/material/expansion';
import { OdometerComponent } from '../odometer/odometer.component';
import { StatsCardComponent } from '../statistics/stats-card/stats-card.component';
import { PenaltySumsComponent } from '../statistics/penalty-sums/penalty-sums.component';
import { PenaltyTableComponent } from '../statistics/penalty-table/penalty-table.component';
import { LivePointsTableComponent } from '../statistics/live-points-table/live-points-table.component';
import { CarouselComponent } from '../shared/carousel/carousel.component';
import { CurrentUserDirective } from '../shared/current-user.directive';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'hop-game',
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
    CelebrationDirective,
    LiveIndicatorComponent,
    ButtonSpinnerDirective,
    MatMenuModule,
    HasPermissionDirective,
    HasAllPermissionsDirective,
    MatExpansionModule,
    OdometerComponent,
    StatsCardComponent,
    PenaltySumsComponent,
    PenaltyTableComponent,
    LivePointsTableComponent,
    CarouselComponent,
    CurrentUserDirective,
    AngularSplitModule,
    MatFabButton,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren('stepper') private steppers!: QueryList<MatStepper>;

  readonly breakpointObserver = inject(BreakpointObserver);
  readonly dialog = inject(MatDialog);
  readonly destroyRef = inject(DestroyRef);

  PlaceTypeEnum = PlaceTypeEnum;
  Context = ContextEnum;
  Permission = Permission;

  private state = inject(GameState);
  private route = inject(ActivatedRoute);

  gameDetails$: Observable<GameDetailDto | null> = this.state.gameDetails$;
  rounds$: Observable<RoundDetailDto[]> = this.state.rounds$;
  players$: Observable<PlayerDto[]> = this.state.players$;
  playersForGameEvents$: Observable<PlayerDto[]> = this.state.playersForGameEvents$;
  warnings$: Observable<number> = this.state.warnings$;
  stats$: Observable<LiveGameStatisticsResponseDto | null> = this.state.stats$;

  isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
    map(state => state.matches)
  );

  showStats = false;

  private updateFinalistsDebouncer$ = new Subject<{ roundId: string; finalistIds: string[] }>();

  ngOnInit() {
    this.updateFinalistsDebouncer$.pipe(
      debounceTime(750),
      switchMap(payload => this.state.updateFinalists(payload)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.route.params.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({id}) => this.state.init(id));

    this.state.openLastRound$.pipe(
      delay(500), // wait for stepper being updated before activating the last step
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.openLastRound());
  }

  ngAfterViewInit(): void {
    this.steppers.changes.pipe(
      withLatestFrom(this.route.queryParams),
      delay(100),
      filter(([_, {roundId}]: [QueryList<MatStepper>, { roundId?: string }]) => !!roundId),
      map(([steppers, {roundId}]: [QueryList<MatStepper>, { roundId?: string }]) => ({
        stepList: steppers.first,
        roundId
      })),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({stepList, roundId}) => {
      const idx = stepList.steps.toArray().findIndex(step => step.state === roundId);
      if (idx >= 0) {
        stepList.selectedIndex = idx;
        const element = document.getElementById(stepList._getStepLabelId(idx));
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({behavior: 'smooth', block: 'start'});
          }, 250);
        }
      } else {
        console.warn(`Could not find round with id ${roundId}`);
      }
    });
  }

  handleUpdateGame(): void {
    this.state.updateGame().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleRemoveGame(): void {
    this.state.removeGame().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleGameEventAdd({context, playerId}: { context: ContextEnum; playerId: string }): void {
    this.state.addEvent(context, playerId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleRoundEventAdd({context, playerId, roundId}: { context: ContextEnum; playerId: string; roundId: string }): void {
    this.state.addEvent(context, playerId, roundId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleGameEventRemove(id: string): void {
    this.state.removeEvent(ContextEnum.Game, id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleRoundEventRemove({id, roundId}: { id: string; roundId: string }): void {
    this.state.removeEvent(ContextEnum.Round, id, roundId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleFinalistsChange(payload: { roundId: string; finalistIds: string[] }): void {
    this.updateFinalistsDebouncer$.next(payload);
  }

  handleAttendanceChange(roundId: string): void {
    this.state.updateAttendance(roundId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  handleRoundRemove(id: string): void {
    this.state.removeRound(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  startNewRound(): void {
    this.state.startNewRound().pipe(
      tap(response => {
        if (response.celebration) {
          this.dialog.open(CelebrationDialogComponent, {data: {celebration: response.celebration}});
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  setGameCompleted(): void {
    this.state.setGameCompleted(true).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private openLastRound(): void {
    this.steppers.first.selectedIndex = this.steppers.first.steps.length - 1;
  }

  ngOnDestroy(): void {
    this.state.reset();
  }
}
