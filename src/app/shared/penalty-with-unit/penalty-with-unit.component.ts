import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { EventTypeDto } from '../../api/openapi';
import PenaltyUnitEnum = EventTypeDto.PenaltyUnitEnum;

@Component({
  selector: 'hop-penalty-with-unit',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './penalty-with-unit.component.html',
  styleUrl: './penalty-with-unit.component.scss'
})
export class PenaltyWithUnitComponent {

  PenaltyUnit = PenaltyUnitEnum;

  penalty = input<number>();
  unit = input.required<string>();
  multiplicatorUnit = input<string>();

}
