import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, input, TemplateRef } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';

@Component({
  selector: 'hop-stats-card',
  standalone: true,
  imports: [
    MatCard,
    NgTemplateOutlet,
    LoadingMaskComponent
  ],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent {

  @ContentChild('value') value!: TemplateRef<any>;
  @ContentChild('description') description!: TemplateRef<any>;
  @ContentChild('details') details!: TemplateRef<any>;

  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

}
