import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, viewChild, viewChildren, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { format, getYear, max, min, set } from 'date-fns';
import { combineLatest, debounceTime, delay, Observable, share, shareReplay } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import {
  AttendancesStatisticsResponseDto,
  CountDto,
  EventTypesStatisticsResponseDto,
  GameIdsWithDatetimeDto,
  GamesAndRoundsStatisticsResponseDto,
  HostsTableDto,
  MostExpensiveGameDto,
  MostExpensiveRoundAveragePerGameDto,
  MostExpensiveRoundDto,
  PenaltyByPlayerTableDto,
  PenaltyDto,
  PenaltyStatisticsResponseDto,
  PointsStatisticsResponseDto,
  QuoteByNameDto, RecordDto,
  RecordsPerGameDto,
  RoundCountByGameIdDto,
  StatisticsService,
  StreakStatisticsResponseDto
} from '../api/openapi';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { LoadingState } from '../shared/loading/loading.state';
import { doWithLoading } from '../shared/operators';
import { AttendanceTableComponent } from './attendance-table/attendance-table.component';
import { FinalsAttendanceTableComponent } from './finals-attendance-table/finals-attendance-table.component';
import { GameAndRoundsComponent } from './game-and-rounds/game-and-rounds.component';
import { HostTableComponent } from './host-table/host-table.component';
import { PenaltySumsComponent } from './penalty-sums/penalty-sums.component';
import { PenaltyTableComponent } from './penalty-table/penalty-table.component';
import { PointsComponent } from './points/points.component';
import { RecordsComponent } from './records/records.component';
import { StreaksComponent } from './streaks/streaks.component';

@Component({
  selector: 'hop-statistics',
  imports: [
    MatTabsModule,
    MatIcon,
    MatFormFieldModule,
    MatMenuModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatCheckbox,
    AsyncPipe,
    HostTableComponent,
    IsLoadingPipe,
    MatButtonModule,
    AttendanceTableComponent,
    FinalsAttendanceTableComponent,
    GameAndRoundsComponent,
    RecordsComponent,
    StreaksComponent,
    PenaltyTableComponent,
    PenaltySumsComponent,
    PointsComponent
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StatisticsComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  private loadingState = inject(LoadingState);
  private statisticsService = inject(StatisticsService);
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  outerTabGroup = viewChild<MatTabGroup>('outerTabGroup');
  innerTabGroups = viewChildren<MatTabGroup>('innerTabGroup');

  filterForm = new FormGroup({
    fromDate: new FormControl<Date | null>(null, {validators: Validators.required}),
    toDate: new FormControl<Date | null>(null, {validators: Validators.required}),
    onlyActivePlayers: new FormControl<boolean>(true, {nonNullable: true, validators: Validators.required}),
  });

  isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
    map(state => state.matches)
  );

  allGames$: Observable<GameIdsWithDatetimeDto[]> = this.statisticsService.allGames().pipe(
    delay(1000),
    doWithLoading(this.loadingState, 'filter-form'),
    shareReplay(1),
  );

  dateClass$: Observable<MatCalendarCellClassFunction<Date>> = this.allGames$.pipe(
    map(games => (cellDate, view) => {
      if (view === 'month') {
        return games.map(({datetime}) => format(datetime, 'yyyy-MM-dd')).includes(format(cellDate, 'yyyy-MM-dd'))
          ? 'game-day'
          : '';
      }
      return '';
    })
  );

  minDate$: Observable<Date> = this.allGames$.pipe(
    map(games => new Date(games[0].datetime)),
    shareReplay(1),
  );

  maxDate$: Observable<Date> = this.allGames$.pipe(
    map(games => new Date(games[games.length - 1].datetime)),
    shareReplay(1),
  );

  years$: Observable<Set<number>> = this.allGames$.pipe(
    map(games => games.map(game => getYear(game.datetime))),
    map(years => years.sort().reverse()),
    map(years => new Set(years)),
  );

  filterChanges$: Observable<{ fromDate: string; toDate: string; onlyActivePlayers: boolean }> = this.filterForm.valueChanges.pipe(
    filter(() => this.filterForm.valid),
    debounceTime(100),
    distinctUntilChanged((prev, curr) =>
      prev.fromDate === curr.fromDate && prev.toDate === curr.toDate && prev.onlyActivePlayers === curr.onlyActivePlayers
    ),
    map(({fromDate, toDate, onlyActivePlayers}) => ({
      fromDate: set(fromDate!, {hours: 0, minutes: 0, seconds: 0}).toISOString(),
      toDate: set(toDate!, {hours: 23, minutes: 59, seconds: 59}).toISOString(),
      onlyActivePlayers: onlyActivePlayers!,
    })),
  );

  gamesAndRoundsStatistics$: Observable<GamesAndRoundsStatisticsResponseDto> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.gamesAndRoundsStatistics(config).pipe(
      doWithLoading(this.loadingState, 'games-and-rounds-statistics'),
    )),
    share(),
  );

  maxRoundsPerGame$: Observable<RoundCountByGameIdDto> = this.gamesAndRoundsStatistics$.pipe(
    map(({maxRoundsPerGame}) => maxRoundsPerGame)
  );

  hostStatistics$: Observable<HostsTableDto[]> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.hostStatistics(config).pipe(
      doWithLoading(this.loadingState, 'host-statistics'),
      map(response => response.hostsTable)
    )),
  );

  attendancesStatistics$: Observable<AttendancesStatisticsResponseDto> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.attendancesStatistics(config).pipe(
      doWithLoading(this.loadingState, 'attendance-statistics'),
    )),
    share(),
  );

  attendanceTable$: Observable<QuoteByNameDto[]> = this.attendancesStatistics$.pipe(
    map(({attendancesTable}) => attendancesTable)
  );

  finalsTable$: Observable<QuoteByNameDto[]> = this.attendancesStatistics$.pipe(
    map(({finalsTable}) => finalsTable)
  );

  eventTypesStatistics$: Observable<EventTypesStatisticsResponseDto> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.eventTypeStatistics(config).pipe(
      doWithLoading(this.loadingState, 'event-type-statistics'),
    )),
    share(),
  );

  recordsPerGame$: Observable<RecordsPerGameDto[]> = this.eventTypesStatistics$.pipe(
    map(({recordsPerGame}) => recordsPerGame)
  );

  penaltyStatistics$: Observable<PenaltyStatisticsResponseDto> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.penaltyStatistics(config).pipe(
      doWithLoading(this.loadingState, 'penalty-statistics'),
    )),
    share(),
  );

  penaltyByPlayerTable$: Observable<PenaltyByPlayerTableDto[]> = this.penaltyStatistics$.pipe(
    map(({penaltyByPlayerTable}) => penaltyByPlayerTable)
  );

  penaltySums$: Observable<PenaltyDto[]> = this.penaltyStatistics$.pipe(
    map(({penaltySum}) => penaltySum)
  );

  euroPerGameAndRound$: Observable<{ euroPerGame: CountDto, euroPerRound: CountDto }> = this.penaltyStatistics$.pipe(
    map(({euroPerGame, euroPerRound}) => ({euroPerGame, euroPerRound}))
  );

  mostExpensiveGameAndRound$: Observable<{
    mostExpensiveGame: MostExpensiveGameDto;
    mostExpensiveRound: MostExpensiveRoundDto;
    mostExpensiveRoundAveragePerGame: MostExpensiveRoundAveragePerGameDto
  }> = this.penaltyStatistics$.pipe(
    map(({mostExpensiveGame, mostExpensiveRound, mostExpensiveRoundAveragePerGame}) => ({
      mostExpensiveGame, mostExpensiveRound, mostExpensiveRoundAveragePerGame
    }))
  );

  streakStatistics$: Observable<StreakStatisticsResponseDto> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.streakStatistics(config).pipe(
      doWithLoading(this.loadingState, 'streak-statistics'),
    )),
  );

  pointsStatistics$: Observable<PointsStatisticsResponseDto> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.pointsStatistics(config).pipe(
      doWithLoading(this.loadingState, 'points-statistics'),
    )),
    share(),
  );

  minGamePoints$: Observable<RecordDto[]> = this.pointsStatistics$.pipe(
    map(({ minGamePoints }) => minGamePoints)
  );

  maxGamePoints$: Observable<RecordDto[]> = this.pointsStatistics$.pipe(
    map(({ maxGamePoints }) => maxGamePoints)
  );

  // // eventTypeCountsByPlayer: this.statisticsService.eventTypeCountsByPlayer(),

  ngOnInit(): void {
    this.minDate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(date => this.filterForm.patchValue({fromDate: date}));
    this.maxDate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(date => this.filterForm.patchValue({toDate: date}));

    this.loadingState.isLoading('filter-form').pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(isLoading => isLoading ? this.filterForm.disable() : this.filterForm.enable());

    this.navigateToActiveTab();
  }

  applyYearToFilter(year: number): void {
    combineLatest([this.minDate$, this.maxDate$]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([minDate, maxDate]) => {
      this.filterForm.patchValue({
        fromDate: max([new Date(`${year}-01-01`), minDate]),
        toDate: min([new Date(`${year}-12-31`), maxDate]),
      });
    });
  }

  resetDateRange(): void {
    combineLatest([this.minDate$, this.maxDate$]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([minDate, maxDate]) => {
      this.filterForm.patchValue({
        fromDate: minDate,
        toDate: maxDate,
      });
    });
  }

  setDateRangeForLatestGame(): void {
    this.allGames$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(games => {
      const latestGame = games[games.length - 1];
      this.filterForm.patchValue({
        fromDate: set(latestGame.datetime, {hours: 0, minutes: 0, seconds: 0}),
        toDate: set(latestGame.datetime, {hours: 23, minutes: 59, seconds: 59}),
      });
    });
  }

  handleTabChange($event: MatTabChangeEvent) {
    const context = $event.tab._closestTabGroup._elementRef.nativeElement.id;
    this.router.navigate(
      ['.'],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          outerIdx: this.outerTabGroup()?.selectedIndex,
          ...(context && $event.index ? {innerId: context, innerIdx: $event.index} : {})
        }
      });
  }

  private navigateToActiveTab() {
    const {outerIdx, innerId, innerIdx} = this.activatedRoute.snapshot.queryParams;
    if (this.outerTabGroup() && outerIdx) {
      this.outerTabGroup()!.selectedIndex = outerIdx;
    }

    if (this.innerTabGroups() && innerId) {
      const group = this.innerTabGroups()!.find(group => group._elementRef.nativeElement.id === innerId);
      if (group && innerIdx) {
        group!.selectedIndex = innerIdx;
      }
    }
  }
}
