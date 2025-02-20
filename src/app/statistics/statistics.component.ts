import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { format, getYear, max, min, set } from 'date-fns';
import { combineLatest, debounceTime, delay, Observable, shareReplay } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import {
  HostsTableDto,
  QuoteByNameDto,
  StatisticsService,
  GameIdsWithDatetimeDto,
  GamesAndRoundsStatisticsResponseDto
} from '../api/openapi';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { LoadingState } from '../shared/loading/loading.state';
import { doWithLoading } from '../shared/operators';
import { AttendanceTableComponent } from './attendance-table/attendance-table.component';
import { FinalsAttendanceTableComponent } from './finals-attendance-table/finals-attendance-table.component';
import { GameAndRoundsComponent } from './game-and-rounds/game-and-rounds.component';
import { HostTableComponent } from './host-table/host-table.component';

@Component({
  selector: 'hop-statistics',
  standalone: true,
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
    GameAndRoundsComponent
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StatisticsComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  private loadingState = inject(LoadingState);
  private statisticsService = inject(StatisticsService);
  private breakpointObserver = inject(BreakpointObserver);

  filterForm = new FormGroup({
    fromDate: new FormControl<Date | null>(null, { validators: Validators.required }),
    toDate: new FormControl<Date | null>(null, { validators: Validators.required }),
    onlyActivePlayers: new FormControl<boolean>(true, { nonNullable: true, validators: Validators.required }),
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
        return games.map(({ datetime }) => format(datetime, 'yyyy-MM-dd')).includes(format(cellDate, 'yyyy-MM-dd'))
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
    map(({ fromDate, toDate, onlyActivePlayers }) => ({
      fromDate: set(fromDate!, { hours: 0, minutes: 0, seconds: 0 }).toISOString(),
      toDate: set(toDate!, { hours: 23, minutes: 59, seconds: 59 }).toISOString(),
      onlyActivePlayers: onlyActivePlayers!,
    })),
  );

  gamesAndRoundsStatistics$: Observable<GamesAndRoundsStatisticsResponseDto> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.gamesAndRoundsStatistics(config).pipe(
      doWithLoading(this.loadingState, 'games-and-rounds-statistics'),
    )),
  );

  hostStatistics$: Observable<HostsTableDto[]> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.hostStatistics(config).pipe(
      doWithLoading(this.loadingState, 'host-statistics'),
      map(response => response.hostsTable)
    )),
  );

  attendancesStatistics$: Observable<QuoteByNameDto[]> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.attendancesStatistics(config).pipe(
      doWithLoading(this.loadingState, 'attendance-statistics'),
      map(response => response.attendancesTable)
    )),
  );

  finalAttendancesStatistics$: Observable<QuoteByNameDto[]> = this.filterChanges$.pipe(
    switchMap(config => this.statisticsService.attendancesStatistics(config).pipe(
      doWithLoading(this.loadingState, 'final-attendance-statistics'),
      map(response => response.finalsTable)
    )),
  );

  // eventTypeStatistics: this.statisticsService.eventTypeStatistics(defaultOptions),
  // // eventTypeCountsByPlayer: this.statisticsService.eventTypeCountsByPlayer(),
  // pointsStatistics: this.statisticsService.pointsStatistics(defaultOptions),
  // penaltyStatistics: this.statisticsService.penaltyStatistics(defaultOptions),
  // streakStatistics: this.statisticsService.streakStatistics(defaultOptions),

  ngOnInit(): void {
    this.minDate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(date => this.filterForm.patchValue({ fromDate: date }));
    this.maxDate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(date => this.filterForm.patchValue({ toDate: date }));

    this.loadingState.isLoading('filter-form').pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(isLoading => isLoading ? this.filterForm.disable() : this.filterForm.enable());
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
        fromDate: set(latestGame.datetime, { hours: 0, minutes: 0, seconds: 0 }),
        toDate: set(latestGame.datetime, { hours: 23, minutes: 59, seconds: 59 }),
      });
    });
  }

}
