import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativizeDate'
})
export class RelativizeDatePipe implements PipeTransform {

  transform(value: Date | string | number, short: boolean = false): string {
    if (!value) return '';

    const now = new Date();
    const date = new Date(value);
    const diffMs = date.getTime() - now.getTime();
    const isFuture = diffMs > 0;
    const diffSec = Math.abs(Math.round(diffMs / 1000));

    if (diffSec < 10) {
      return isFuture ? 'in einem Moment' : 'gerade eben';
    }

    const units = [
      { name: 'Tag', pluralName: 'Tagen', shortName: 'd', seconds: 86400 },
      { name: 'Stunde', pluralName: 'Stunden', shortName: 'h', seconds: 3600 },
      { name: 'Minute', pluralName: 'Minuten', shortName: 'min', seconds: 60 },
      { name: 'Sekunde', pluralName: 'Sekunden', shortName: 's', seconds: 1 }
    ];

    let remaining = diffSec;
    const parts: string[] = [];

    for (const unit of units) {
      const amount = Math.floor(remaining / unit.seconds);
      if (amount > 0) {
        remaining -= amount * unit.seconds;
        let unitName;
        if (short) {
          unitName = unit.shortName;
        } else {
          unitName = amount === 1 ? unit.name : unit.pluralName;
        }

        parts.push(`${amount}${short ? '' : ' '}${unitName}`);
      }

      if (parts.length === 2) break; // nur zwei Zeiteinheiten
    }

    const prefix = isFuture ? 'in' : 'vor';
    return `${prefix} ${parts.join(' ')}`;
  }

}
