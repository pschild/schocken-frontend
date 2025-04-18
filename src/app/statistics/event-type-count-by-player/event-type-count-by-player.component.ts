import { AsyncPipe } from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {Observable, tap} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import { CountByNameDto, EventTypeDto, EventTypeService } from '../../api/openapi';
import { EventTypeCountByPlayerTableComponent } from '../event-type-count-by-player-table/event-type-count-by-player-table.component';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'hop-event-type-count-by-player',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    EventTypeCountByPlayerTableComponent,
    AsyncPipe
  ],
  templateUrl: './event-type-count-by-player.component.html',
  styleUrl: './event-type-count-by-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventTypeCountByPlayerComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  data = input<CountByNameDto[], CountByNameDto[] | null>([], {
    transform: (value: CountByNameDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  private eventTypeService = inject(EventTypeService);

  onEventTypeChange = output<string>();

  selectControl = new FormControl<string>('');

  allEventTypes$: Observable<EventTypeDto[]> = this.eventTypeService.findAll().pipe(
    map(types => types.sort((a, b) => a.description.localeCompare(b.description))),
    tap(types => this.selectControl.setValue(types[0].id))
  );

  ngOnInit(): void {
    this.selectControl.valueChanges.pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => this.onEventTypeChange.emit(value));
  }

}
