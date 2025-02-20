import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GamesAndRoundsStatisticsResponseDto } from '../../api/openapi';
import { OdometerComponent } from '../../odometer/odometer.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';

@Component({
  selector: 'hop-game-and-rounds',
  standalone: true,
  imports: [OdometerComponent, MatCardModule, DatePipe, StatsCardComponent],
  templateUrl: './game-and-rounds.component.html',
  styleUrl: './game-and-rounds.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameAndRoundsComponent {

  data = input<GamesAndRoundsStatisticsResponseDto | null>();
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

}
