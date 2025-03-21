import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EventTypeDto, PenaltyDto } from '../../api/openapi';
import { OdometerComponent } from '../../odometer/odometer.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import PenaltyUnitEnum = EventTypeDto.PenaltyUnitEnum;

@Component({
  selector: 'hop-penalty-sums',
  imports: [
    OdometerComponent,
    StatsCardComponent
  ],
  templateUrl: './penalty-sums.component.html',
  styleUrl: './penalty-sums.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PenaltySumsComponent {

  PenaltyUnit = PenaltyUnitEnum;

  data = input<PenaltyDto[], PenaltyDto[] | null>([], {
    transform: (value: PenaltyDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

}
