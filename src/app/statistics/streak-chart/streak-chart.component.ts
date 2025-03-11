import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { StreakDto } from '../../api/openapi';
import { OdometerComponent } from '../../odometer/odometer.component';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { RankComponent } from '../rank/rank.component';

@Component({
  selector: 'hop-streak-chart',
  standalone: true,
  imports: [
    DatePipe,
    OdometerComponent,
    RankComponent,
    MatTooltip,
    CurrentUserDirective,

  ],
  templateUrl: './streak-chart.component.html',
  styleUrl: './streak-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreakChartComponent {

  streaks = input.required<StreakDto[]>();
  overallMaxStreak = computed(() => this.streaks()[0].maxStreak);

}
