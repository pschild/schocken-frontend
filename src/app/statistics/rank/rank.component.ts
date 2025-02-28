import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'hop-rank',
  standalone: true,
  imports: [
    NgClass,
    MatIcon
  ],
  templateUrl: './rank.component.html',
  styleUrl: './rank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankComponent {

  rank = input.required<number>();

}
