import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { getYear } from 'date-fns';
import { groupBy } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameOverviewService as NgOpenapiGenGameOverviewService } from '../api/ng-openapi-gen/services/game-overview.service';
import { GameOverviewDto, GameOverviewService as OpenApiGameOverviewService } from '../api/openapi';
import { LiveIndicatorComponent } from '../live-indicator/live-indicator.component';
import { PenaltyWithUnitComponent } from '../shared/penalty-with-unit/penalty-with-unit.component';

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

  gameOverview$: Observable<OverviewItem[]> | undefined;

  private ngOpenapiGenGameOverviewService = inject(NgOpenapiGenGameOverviewService);
  private openApiGameOverviewService = inject(OpenApiGameOverviewService);

  ngOnInit(): void {
    // this.ngOpenapiGenGameOverviewService.getOverview().subscribe(console.log);
    this.gameOverview$ = this.openApiGameOverviewService.getOverview().pipe(
      map(res => groupBy(res, item => getYear(item.datetime))),
      map(res => Object.entries<GameOverviewDto[]>(res).map(([year, games]) => ({ year, games }))),
      map((items: OverviewItem[]) => items.sort((a, b) => +b.year - +a.year)),
    );
    this.gameOverview$.subscribe(console.log);
  }

}
