import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { getYear } from 'date-fns';
import { groupBy } from 'lodash';
import { Observable, switchMap, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GameOverviewService as NgOpenapiGenGameOverviewService } from '../api/ng-openapi-gen/services/game-overview.service';
import { GameOverviewDto, GameOverviewService as OpenApiGameOverviewService, GameService, PlayerService } from '../api/openapi';
import { GameDetailsFormComponent } from '../game/game-details-form/game-details-form.component';
import { LiveIndicatorComponent } from '../live-indicator/live-indicator.component';
import { PenaltyWithUnitComponent } from '../shared/penalty-with-unit/penalty-with-unit.component';
import { SuccessMessageService } from '../shared/success-message.service';

interface OverviewItem {
  year: string;
  games: GameOverviewDto[];
}

@Component({
  selector: 'hop-home',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, RouterModule, MatIconModule, LiveIndicatorComponent, MatIconButton, MatButton, MatFabButton, PenaltyWithUnitComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  readonly dialog = inject(MatDialog);

  gameOverview$: Observable<OverviewItem[]> | undefined;

  private ngOpenapiGenGameOverviewService = inject(NgOpenapiGenGameOverviewService);
  private openApiGameOverviewService = inject(OpenApiGameOverviewService);
  private gameService = inject(GameService);
  private playerService = inject(PlayerService);
  private successMessageService = inject(SuccessMessageService);
  private router = inject(Router);

  ngOnInit(): void {
    // this.ngOpenapiGenGameOverviewService.getOverview().subscribe(console.log);
    this.gameOverview$ = this.openApiGameOverviewService.getOverview().pipe(
      map(res => groupBy(res, item => getYear(item.datetime))),
      map(res => Object.entries<GameOverviewDto[]>(res).map(([year, games]) => ({ year, games }))),
      map((items: OverviewItem[]) => items.sort((a, b) => +b.year - +a.year)),
    );
  }

  createNewGame(): void {
    this.playerService.findAll().pipe(
      switchMap(players => {
        return this.dialog.open(GameDetailsFormComponent, {
          minWidth: 500,
          height: '350px',
          data: {
            players,
          }
        }).afterClosed();
      }),
      filter(result => !!result),
      switchMap(({ type, hostedById, placeOfAwayGame, excludeFromStatistics }) => this.gameService.create({ placeType: type, hostedById, placeOfAwayGame, excludeFromStatistics })),
      tap(game => this.router.navigate(['game', game.id])),
      tap(() => this.successMessageService.showSuccess(`Spiel erstellt`)),
    ).subscribe();
  }

}
