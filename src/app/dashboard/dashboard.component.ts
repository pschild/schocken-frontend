import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PlayerPenaltiesTableComponent } from './player-penalties-table/player-penalties-table.component';
import { AsyncPipe } from '@angular/common';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { UserPaymentDto, UserPaymentService } from '../api/openapi';
import { LoadingState } from '../shared/loading/loading.state';
import { Observable } from 'rxjs';
import { ConfigService } from '../shared/config.service';
import { doWithLoading } from '../shared/operators';
import { PenaltySummaryComponent } from './penalty-summary/penalty-summary.component';

@Component({
  selector: 'hop-dashboard',
  imports: [
    PlayerPenaltiesTableComponent,
    AsyncPipe,
    IsLoadingPipe,
    PenaltySummaryComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

  private userPaymentService = inject(UserPaymentService);
  private configService = inject(ConfigService);
  private loadingState = inject(LoadingState);

  paymentsByPlayer$: Observable<UserPaymentDto[]> = this.userPaymentService.getByUserId().pipe(
    doWithLoading(this.loadingState, 'payments'),
  );

  currentPlayerName: string | null = this.configService.getCurrentPlayerName();

  ngOnInit(): void {
  }
}
