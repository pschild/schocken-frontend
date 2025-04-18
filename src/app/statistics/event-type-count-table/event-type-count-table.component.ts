import { DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EventTypeCountsDto } from '../../api/openapi';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';

@Component({
  selector: 'hop-event-type-count-table',
  imports: [
    LoadingMaskComponent,
    MatTableModule,
    MatSortModule,
    ScrollWrapperDirective,
    DecimalPipe,
    PenaltyWithUnitComponent
  ],
  templateUrl: './event-type-count-table.component.html',
  styleUrl: './event-type-count-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventTypeCountTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<EventTypeCountsDto[], EventTypeCountsDto[] | null>([], {
    transform: (value: EventTypeCountsDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['description', 'count', 'penalty'];
  dataSource: MatTableDataSource<EventTypeCountsDto> = new MatTableDataSource();

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
  }

}
