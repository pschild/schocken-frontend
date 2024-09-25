import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { EventTypeDto } from '../../api/openapi';
import PenaltyUnitEnum = EventTypeDto.PenaltyUnitEnum;

@Component({
  selector: 'hop-penalty-with-unit',
  standalone: true,
  imports: [
    DecimalPipe,
    CurrencyPipe
  ],
  templateUrl: './penalty-with-unit.component.html',
  styleUrl: './penalty-with-unit.component.scss'
})
export class PenaltyWithUnitComponent {

  PenaltyUnit = PenaltyUnitEnum;

  penalty = input.required<number>();
  unit = input.required<string>();
  multiplicatorUnit = input<string>();

}
