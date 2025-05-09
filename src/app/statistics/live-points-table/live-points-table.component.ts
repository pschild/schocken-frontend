import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, input, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RankComponent } from '../rank/rank.component';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { LiveGamePointsTableDto } from '../../api/openapi';

@Component({
  selector: 'hop-live-points-table',
  imports: [
    LoadingMaskComponent,
    MatTableModule,
    MatSortModule,
    RankComponent,
    CurrentUserDirective,
    DecimalPipe,
    ScrollWrapperDirective,
  ],
  templateUrl: './live-points-table.component.html',
  styleUrl: './live-points-table.component.scss'
})
export class LivePointsTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<LiveGamePointsTableDto[], LiveGamePointsTableDto[] | null>([], {
    transform: (value: LiveGamePointsTableDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['rank', 'name', 'gamePoints', 'points', 'rankYear', 'pointsYear'];
  dataSource: MatTableDataSource<LiveGamePointsTableDto> = new MatTableDataSource();

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    // make null values be sorted after others
    // @ts-ignore
    this.dataSource.sortingDataAccessor = (item, property) => item[property] || Infinity;

    this.dataSource.sort = this.sort();
  }

}
