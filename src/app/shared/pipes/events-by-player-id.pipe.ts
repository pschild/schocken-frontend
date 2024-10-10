import { Pipe, PipeTransform } from '@angular/core';
import { EventDetailDto } from '../../api/openapi';

@Pipe({
  name: 'eventsByPlayerId',
  standalone: true
})
export class EventsByPlayerIdPipe implements PipeTransform {

  transform(events: EventDetailDto[], playerId: string): EventDetailDto[] {
    return events.filter(event => event.playerId === playerId);
  }

}
