import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import De from '@fullcalendar/core/locales/de';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEventDialogComponent } from './calendar-event-dialog/calendar-event-dialog.component';

@Component({
  selector: 'hop-calendar',
  imports: [FullCalendarModule, MatButtonToggleModule, MatIcon, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent | undefined;

  activeView: WritableSignal<'listYear' | 'multiMonthYear'> = signal('listYear');

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  calendarOptions: CalendarOptions = {
    locale: De,
    initialView: 'listYear',
    plugins: [listPlugin, multiMonthPlugin, interactionPlugin],
    multiMonthMaxColumns: 1,
    height: 800,
    headerToolbar: false,
    eventDisplay: 'block',
    selectable: true,
    dateClick: (arg) => {
      /*console.log('dateClick', arg);
      this.dialog.open(CalendarEventDialogComponent, {
        // minWidth: '90vw',
        data: {
          startDate: arg.date,
        }
      }).afterClosed().subscribe(console.log);*/
    },
    eventClick: (arg) => {
      /*console.log('eventClick', arg.event);
      this.dialog.open(CalendarEventDialogComponent, {
        // minWidth: '90vw',
        data: {
          startDate: arg.event.start,
          endDate: arg.event.end,
          isAllDay: arg.event.allDay,
          event: {
            title: arg.event.title,
            props: arg.event.extendedProps
          }
        }
      }).afterClosed().subscribe(console.log);*/
    },
    select: (arg) => console.log('select', arg),
    events: [
      { title: 'Männerabend bei Christian', start: '2025-04-04T17:30:00.000Z', end: '2025-04-04T22:00:00.000Z', extendedProps: { id: 'xxx1', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: '027edf6e-8421-4325-8473-d3af0d5483db' } },
      { title: 'Männerabend bei Martin', start: '2025-05-02T17:30:00.000Z', end: '2025-05-02T22:00:00.000Z', extendedProps: { id: 'xxx2', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: 'fa8f7251-2106-4b59-bbcd-d9e688ea496d' } },
      { title: 'Männerabend bei Sören', start: '2025-06-06T17:30:00.000Z', end: '2025-06-06T22:00:00.000Z', extendedProps: { id: 'xxx3', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: '7230c509-1bad-4a81-9806-aba3bba6223c' } },
      { title: 'Männerabend bei Christoph', start: '2025-07-04T17:30:00.000Z', end: '2025-07-04T22:00:00.000Z', extendedProps: { id: 'xxx4', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: 'e055f01f-cf6e-4f50-aff4-847213248526' } },
      { title: 'Männerabend bei Felix', start: '2025-08-01T17:30:00.000Z', end: '2025-08-01T22:00:00.000Z', extendedProps: { id: 'xxx5', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: '213867f5-e27f-4047-a8e6-8b12aa84f2ad' } },
      { title: 'Männerabend bei Patrick', start: '2025-09-05T17:30:00.000Z', end: '2025-09-05T22:00:00.000Z', extendedProps: { id: 'xxx6', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: 'b3973ac4-9057-4262-bbf4-c44af81ccb15' } },
      { title: 'Männerabend bei Florian', start: '2025-10-03T17:30:00.000Z', end: '2025-10-03T22:00:00.000Z', extendedProps: { id: 'xxx7', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: '716701d8-2885-4a4d-ae17-1894bfff2b64' } },
      { title: 'Männerabend bei Philippe', start: '2025-11-07T18:30:00.000Z', end: '2025-11-07T23:00:00.000Z', extendedProps: { id: 'xxx8', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: 'b98b5a5e-9228-4055-8c30-0349599ef1e7' } },
      { title: 'Männerabend bei Leo', start: '2025-12-05T18:30:00.000Z', end: '2025-12-05T23:00:00.000Z', extendedProps: { id: 'xxx9', type: 'SCHOCKENABEND', placeType: 'HOME', hostedById: '326c8728-cd63-4367-809b-ef3369f00439' } },
      { title: 'Hopti-Tour 2025', start: '2025-09-12', end: '2025-09-14T23:59:59Z', allDay: true, extendedProps: { id: 'xxx10', type: 'TOUR', description: 'tbd' } }, // add `T23:59:59Z` to end date
    ],
    viewDidMount: (arg) => this.cdr.detectChanges(), // update the title after mounted
    eventDidMount: (arg) => {
      switch (arg.event.extendedProps['type']) {
        case 'SCHOCKENABEND':
          arg.event.setProp('color', '#ffa500');
          break;
        case 'TOUR':
          arg.event.setProp('color', '#f00');
          break;
        default:
          arg.event.setProp('color', '#3788d8');
      }

      if (arg.isPast) {
        arg.el.style.opacity = '0.6';
      }
    },
  };

  previousYear(): void {
    this.calendarComponent!.getApi().prev();
  }

  nextYear(): void {
    this.calendarComponent!.getApi().next();
  }

  changeView(type: 'listYear' | 'multiMonthYear'): void {
    this.calendarComponent!.getApi().changeView(type);
  }
}
