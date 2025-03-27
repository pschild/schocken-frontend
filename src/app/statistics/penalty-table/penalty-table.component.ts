import { CurrencyPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PenaltyByPlayerTableDto } from '../../api/openapi';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';
import { RankComponent } from '../rank/rank.component';

@Component({
  selector: 'hop-penalty-table',
  imports: [
    LoadingMaskComponent,
    MatTableModule,
    MatSortModule,
    RankComponent,
    CurrentUserDirective,
    CurrencyPipe,
    PercentPipe,
    ScrollWrapperDirective
  ],
  templateUrl: './penalty-table.component.html',
  styleUrl: './penalty-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PenaltyTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<PenaltyByPlayerTableDto[], PenaltyByPlayerTableDto[] | null>([], {
    transform: (value: PenaltyByPlayerTableDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['rank', 'name', 'gameEventEuroSum', 'roundEventEuroSum', 'euroSum', 'quote', 'euroPerRound'];
  dataSource: MatTableDataSource<PenaltyByPlayerTableDto> = new MatTableDataSource();

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
