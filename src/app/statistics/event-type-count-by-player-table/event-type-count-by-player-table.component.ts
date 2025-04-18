import { DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CountByNameDto } from '../../api/openapi';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';

@Component({
  selector: 'hop-event-type-count-by-player-table',
  imports: [
    DecimalPipe,
    LoadingMaskComponent,
    MatTableModule,
    MatSortModule,
    ScrollWrapperDirective,
    CurrentUserDirective
  ],
  templateUrl: './event-type-count-by-player-table.component.html',
  styleUrl: './event-type-count-by-player-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventTypeCountByPlayerTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<CountByNameDto[], CountByNameDto[] | null>([], {
    transform: (value: CountByNameDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['name', 'count', 'quote'];
  dataSource: MatTableDataSource<CountByNameDto> = new MatTableDataSource();

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
