import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PlayerPenaltiesTableComponent } from './player-penalties-table/player-penalties-table.component';
import { AsyncPipe } from '@angular/common';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { DashboardService, StreakDto, UserPaymentDto, UserPaymentService } from '../api/openapi';
import { LoadingState } from '../shared/loading/loading.state';
import { Observable } from 'rxjs';
import { ConfigService } from '../shared/config.service';
import { doWithLoading } from '../shared/operators';
import { PenaltySummaryComponent } from './penalty-summary/penalty-summary.component';
import { StreakChartComponent } from '../statistics/streak-chart/streak-chart.component';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'hop-dashboard',
  imports: [
    PlayerPenaltiesTableComponent,
    AsyncPipe,
    IsLoadingPipe,
    PenaltySummaryComponent,
    StreakChartComponent,
    MatProgressSpinner,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

  private userPaymentService = inject(UserPaymentService);
  private dashboardService = inject(DashboardService);
  private configService = inject(ConfigService);
  private loadingState = inject(LoadingState);

  paymentsByPlayer$: Observable<UserPaymentDto[]> = this.userPaymentService.getByUserId().pipe(
    doWithLoading(this.loadingState, 'payments'),
  );

  streaks$: Observable<{ label: string; streaks: StreakDto[] }[]> = this.dashboardService.getCurrentStreaksByUser().pipe(
    map(streaks => {
      const noEventTypeStreaks = streaks.noEventTypeStreaks.flatMap(s => ({ label: `...ohne ${s.description}`, streaks: s.streaks }));
      const eventTypeStreaks = streaks.eventTypeStreaks.flatMap(s => ({ label: `...mit ${s.description}`, streaks: s.streaks }));
      const noPenaltyStreaks = { label: `...ohne Strafe`, streaks: streaks.noPenaltyStreaks };
      const penaltyStreaks = { label: `...mit Strafe`, streaks: streaks.penaltyStreaks };
      const attendanceStreaks = { label: `...mit Teilnahme`, streaks: streaks.attendanceStreaks };

      return orderBy(
        [...noEventTypeStreaks, ...eventTypeStreaks, noPenaltyStreaks, penaltyStreaks, attendanceStreaks].filter(item => item.streaks.length > 0),
        (item) => item.streaks[0].currentStreak / item.streaks[0].maxStreak, 'desc'
      );
    }),
    doWithLoading(this.loadingState, 'streaks'),
  );

  currentPlayerName: string | null = this.configService.getCurrentPlayerName();

  ngOnInit(): void {
  }
}
