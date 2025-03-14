import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'hop-rank',
  standalone: true,
  imports: [
    NgClass,
    MatIcon,
  ],
  templateUrl: './rank.component.html',
  styleUrl: './rank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankComponent {

  rank = input.required<number>();

  tendency = input<number>();
  tendencyInfo = computed<{ type: 'eq' | 'up' | 'down', count?: number } | undefined>(() => {
    const tend = Number(this.tendency());
    if (!isNaN(tend)) {
      return tend === 0
        ? { type: 'eq' }
        : tend > 0
        ? { type: 'up', count: Math.abs(tend) }
        : { type: 'down', count: Math.abs(tend) }
    }
    return undefined;
  });

}
