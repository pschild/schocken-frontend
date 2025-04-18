import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  MostExpensiveGameDto,
  MostExpensiveRoundAveragePerGameDto,
  MostExpensiveRoundDto,
  RecordDto, RecordsPerGameDto,
  RoundCountByGameIdDto, SchockAusStreakDto
} from '../../api/openapi';
import { OdometerComponent } from '../../odometer/odometer.component';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { StatsCardComponent } from '../stats-card/stats-card.component';

@Component({
  selector: 'hop-records',
  imports: [
    StatsCardComponent,
    OdometerComponent,
    DatePipe,
    CarouselComponent,
    CurrentUserDirective
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsComponent {

  recordsPerGame = input<RecordsPerGameDto[] | null>();
  recordsPerGameLoading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  maxRoundsPerGame = input<RoundCountByGameIdDto | null>();
  maxRoundsPerGameLoading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  mostExpensiveGameAndRound = input<{
    mostExpensiveGame: MostExpensiveGameDto;
    mostExpensiveRound: MostExpensiveRoundDto;
    mostExpensiveRoundAveragePerGame: MostExpensiveRoundAveragePerGameDto
  } | null>();
  mostExpensiveGameAndRoundLoading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  minGamePoints = input<RecordDto[] | null>();
  minGamePointsLoading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  maxGamePoints = input<RecordDto[] | null>();
  maxGamePointsLoading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  schockAusStreak = input<SchockAusStreakDto | null>();
  schockAusStreakLoading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });
}
