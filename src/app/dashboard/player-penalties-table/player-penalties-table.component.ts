import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BadgeType } from '../../shared/badge/badge-type';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { isPast } from 'date-fns';
import { MatTooltip } from '@angular/material/tooltip';
import { UserPaymentDto } from '../../api/openapi';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { RelativizeDatePipe } from '../../shared/pipes/relativize-date.pipe';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'hop-player-penalties-table',
  imports: [
    MatTableModule,
    MatSortModule,
    LoadingMaskComponent,
    ScrollWrapperDirective,
    PenaltyWithUnitComponent,
    BadgeComponent,
    DatePipe,
    RouterLink,
    MatTooltip,
    MatCheckbox,
    RelativizeDatePipe,
    MatIcon
  ],
  templateUrl: './player-penalties-table.component.html',
  styleUrl: './player-penalties-table.component.scss'
})
export class PlayerPenaltiesTableComponent implements AfterViewInit {

  sort = viewChild.required(MatSort);

  data = input<UserPaymentDto[], UserPaymentDto[] | null>([], {
    transform: (value: UserPaymentDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  displayedColumns: string[] = ['datetime', 'penaltyValue', 'outstandingValue', 'paymentStatus', 'dueDate'];
  dataSource: MatTableDataSource<UserPaymentDto> = new MatTableDataSource();

  protected readonly BadgeType = BadgeType;
  protected readonly isPast = isPast;

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();

    this.dataSource.filterPredicate = (item, filter) => {
      const filterObj = JSON.parse(filter);
      if (!filterObj.showDone) {
        return !item.confirmed || item.outstandingValue > 0;
      }
      return true;
    };

    this.dataSource.filter = JSON.stringify({ showDone: false });
  }

  handleFilterCheckboxChange(event: MatCheckboxChange): void {
    this.dataSource.filter = JSON.stringify({ showDone: event.checked });
  }
}
