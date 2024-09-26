import { Pipe, PipeTransform } from '@angular/core';
import { CreateGameDto } from '../../api/openapi';
import PlaceTypeEnum = CreateGameDto.PlaceTypeEnum;

const enumToValueMap = {
  [PlaceTypeEnum.Home]: 'zu Hause',
  [PlaceTypeEnum.Away]: 'auswärts',
  [PlaceTypeEnum.Remote]: 'Remote',
};

@Pipe({
  name: 'placeTypeToLabel',
  standalone: true
})
export class PlaceTypeToLabelPipe implements PipeTransform {

  transform(value: string): string {
    return enumToValueMap[value];
  }

}
