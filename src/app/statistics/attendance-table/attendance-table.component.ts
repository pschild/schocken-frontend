import { DecimalPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QuoteByNameDto } from '../../api/openapi';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { RankComponent } from '../rank/rank.component';

@Component({
  selector: 'hop-attendance-table',
  imports: [MatTableModule, MatSortModule, LoadingMaskComponent, DecimalPipe, PercentPipe, RankComponent, CurrentUserDirective],
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<QuoteByNameDto[], QuoteByNameDto[] | null>([], {
    transform: (value: QuoteByNameDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['rank', 'name', 'count', 'quote'];
  dataSource: MatTableDataSource<QuoteByNameDto> = new MatTableDataSource();

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
