import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, input, TemplateRef } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';

@Component({
  selector: 'hop-stats-card',
  standalone: true,
  imports: [
    MatCard,
    NgTemplateOutlet,
    LoadingMaskComponent,
    MatIcon,
    MatTooltip,
    MatIconButton,
  ],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCardComponent {

  @ContentChild('value') value!: TemplateRef<any>;
  @ContentChild('description') description!: TemplateRef<any>;
  @ContentChild('details') details!: TemplateRef<any>;

  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  infoText = input<string>();

}
