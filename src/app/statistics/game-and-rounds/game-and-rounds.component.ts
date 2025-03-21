import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CountDto, GamesAndRoundsStatisticsResponseDto } from '../../api/openapi';
import { OdometerComponent } from '../../odometer/odometer.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';

@Component({
  selector: 'hop-game-and-rounds',
  imports: [OdometerComponent, MatCardModule, StatsCardComponent],
  templateUrl: './game-and-rounds.component.html',
  styleUrl: './game-and-rounds.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameAndRoundsComponent {

  gamesAndRoundsData = input<GamesAndRoundsStatisticsResponseDto | null>();
  gamesAndRoundsLoading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  penaltyData = input<{ euroPerGame: CountDto, euroPerRound: CountDto } | null>();
  penaltyLoading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

}
