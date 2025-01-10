import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GameDetailsService, GameOverviewOfYearDto, GameOverviewService, PlayerService } from '../api/openapi';
import { GameDetailsFormComponent } from '../game/game-details-form/game-details-form.component';
import { LiveIndicatorComponent } from '../live-indicator/live-indicator.component';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { LoadingState } from '../shared/loading/loading.state';
import { doWithLoading } from '../shared/operators';
import { PenaltyWithUnitComponent } from '../shared/penalty-with-unit/penalty-with-unit.component';
import { SuccessMessageService } from '../shared/success-message.service';

@Component({
  selector: 'hop-home',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, RouterModule, MatIconModule, LiveIndicatorComponent, MatIconButton, MatButton, MatFabButton, PenaltyWithUnitComponent, IsLoadingPipe, MatProgressSpinner],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  gameOverview: GameOverviewOfYearDto[] = [];

  private openApiGameOverviewService = inject(GameOverviewService);
  private gameDetailsService = inject(GameDetailsService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);
  private router = inject(Router);
  private loadingState = inject(LoadingState);

  ngOnInit(): void {
    this.openApiGameOverviewService.getOverview().pipe(
      doWithLoading(this.loadingState, 'game-overview'),
    ).subscribe(overview => this.gameOverview = overview);
  }

  createNewGame(): void {
    this.playerService.findAll().pipe(
      switchMap(players => {
        return this.dialog.open(GameDetailsFormComponent, {
          minWidth: 500,
          height: 'auto',
          data: {
            players,
            hideCompleteControl: true,
          }
        }).afterClosed();
      }),
      filter(result => !!result),
      switchMap(({ placeType, hostedById, placeOfAwayGame, excludeFromStatistics }) => this.gameDetailsService.create({ placeType, hostedById, placeOfAwayGame, excludeFromStatistics })),
      tap(game => this.router.navigate(['game', game.id])),
      tap(() => this.successMessageService.showSuccess(`Spiel erstellt`)),
    ).subscribe();
  }

}
