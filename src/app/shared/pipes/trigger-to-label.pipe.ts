import { Pipe, PipeTransform } from '@angular/core';
import { EventTypeDto } from '../../api/openapi';
import TriggerEnum = EventTypeDto.TriggerEnum;

const enumToValueMap = {
  [TriggerEnum.StartNewRound]: 'neue Runde starten',
  [TriggerEnum.SchockAus]: 'Schock Aus',
  [TriggerEnum.SchockAusPenalty]: 'Schock Aus Strafe',
};

@Pipe({
  name: 'triggerToLabel',
  standalone: true
})
export class TriggerToLabelPipe implements PipeTransform {

  transform(value: string): string {
    return enumToValueMap[value];
  }

}
