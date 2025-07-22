import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  viewChild
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { BadgeType } from '../../shared/badge/badge-type';
import { PaymentBalanceDto } from '../../api/openapi';

@Component({
  selector: 'hop-balance-table',
  imports: [
    MatTableModule,
    MatSortModule,
    LoadingMaskComponent,
    CurrentUserDirective,
    ScrollWrapperDirective,
    PenaltyWithUnitComponent,
    BadgeComponent
  ],
  templateUrl: './balance-table.component.html',
  styleUrl: './balance-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<PaymentBalanceDto[], PaymentBalanceDto[] | null>([], {
    transform: (value: PaymentBalanceDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['name', 'penaltyValue', 'outstandingValue', 'status'];
  dataSource: MatTableDataSource<PaymentBalanceDto> = new MatTableDataSource();

  protected readonly BadgeType = BadgeType;

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
