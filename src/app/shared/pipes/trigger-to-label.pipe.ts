import { Pipe, PipeTransform } from '@angular/core';
import { EventTypeDto } from '../../api/openapi';
import TriggerEnum = EventTypeDto.TriggerEnum;

const enumToValueMap = {
  [TriggerEnum.Verloren]: 'neue Runde starten',
  [TriggerEnum.SchockAus]: 'Schock Aus',
  [TriggerEnum.SchockAusStrafe]: 'Schock Aus Strafe',
  [TriggerEnum.Lustwurf]: 'Lustwurf',
  [TriggerEnum.ZweiZweiEins]: '2-2-1',
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
