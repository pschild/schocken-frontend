import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GameDetailsService, GameOverviewOfYearDto, GameOverviewService, PlayerService } from '../api/openapi';
import { HasPermissionDirective } from '../auth/has-permission.directive';
import { Permission } from '../auth/model/permission.enum';
import { GameDetailsFormComponent } from '../game/game-details-form/game-details-form.component';
import { LiveIndicatorComponent } from '../live-indicator/live-indicator.component';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { LoadingState } from '../shared/loading/loading.state';
import { doWithLoading } from '../shared/operators';
import { PenaltyWithUnitComponent } from '../shared/penalty-with-unit/penalty-with-unit.component';
import { SuccessMessageService } from '../shared/success-message.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'hop-home',
  imports: [CommonModule, MatExpansionModule, RouterModule, MatIconModule, LiveIndicatorComponent, MatFabButton, PenaltyWithUnitComponent, IsLoadingPipe, MatProgressSpinner, HasPermissionDirective, HasPermissionDirective, MatListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);

  gameOverview: GameOverviewOfYearDto[] = [];

  private openApiGameOverviewService = inject(GameOverviewService);
  private gameDetailsService = inject(GameDetailsService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);
  private router = inject(Router);
  private loadingState = inject(LoadingState);

  isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
    map(state => state.matches)
  );

  Permission = Permission;

  ngOnInit(): void {
    this.openApiGameOverviewService.getOverview().pipe(
      doWithLoading(this.loadingState, 'game-overview'),
    ).subscribe(overview => this.gameOverview = overview);
  }

  createNewGame(): void {
    this.playerService.findAll().pipe(
      switchMap(players => {
        return this.dialog.open(GameDetailsFormComponent, {
          width: '90vw',
          height: 'auto',
          data: {
            players,
            hideCompleteControl: true,
          }
        }).afterClosed();
      }),
      filter(result => !!result),
      switchMap(({placeType, hostedById, placeOfAwayGame, excludeFromStatistics}) => this.gameDetailsService.create({
        placeType,
        hostedById,
        placeOfAwayGame,
        excludeFromStatistics
      })),
      tap(game => this.router.navigate(['game', game.id])),
      tap(() => this.successMessageService.showSuccess(`Spiel erstellt`)),
    ).subscribe();
  }

}
