import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, input, TemplateRef } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'hop-stats-card',
  imports: [
    MatCard,
    NgTemplateOutlet,
    MatIcon,
    MatTooltip,
    MatIconButton,
    MatProgressSpinner,
  ],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCardComponent {

  @ContentChild('value') value!: TemplateRef<any>;
  @ContentChild('description') description!: TemplateRef<any>;
  @ContentChild('details') details!: TemplateRef<any>;

  loading = input<boolean>(false);
  infoText = input<string>();

}
