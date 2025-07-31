import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ContentChild, input, TemplateRef } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { StreakDto } from '../../api/openapi';
import { MatIcon } from '@angular/material/icon';
import { AutoPlacementDirective } from '../../shared/pipes/auto-placement.directive';

@Component({
  selector: 'hop-streak-chart',
  imports: [
    DatePipe,
    MatTooltip,
    MatIcon,
    NgTemplateOutlet,
    AutoPlacementDirective,
    DecimalPipe,
  ],
  templateUrl: './streak-chart.component.html',
  styleUrl: './streak-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreakChartComponent {

  streaks = input.required<StreakDto[]>();
  overallMaxStreak = computed(() => this.streaks()[0].overallHighscore?.maxStreak ?? 1);

  @ContentChild('label') label!: TemplateRef<any>;

}
