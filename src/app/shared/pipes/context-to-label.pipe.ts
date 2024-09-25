import { Pipe, PipeTransform } from '@angular/core';
import { EventTypeDto } from '../../api/openapi';
import ContextEnum = EventTypeDto.ContextEnum;

const enumToValueMap = {
  [ContextEnum.Round]: 'Runde',
  [ContextEnum.Game]: 'Spiel',
};

@Pipe({
  name: 'contextToLabel',
  standalone: true
})
export class ContextToLabelPipe implements PipeTransform {

  transform(value: string): string {
    return enumToValueMap[value];
  }

}
