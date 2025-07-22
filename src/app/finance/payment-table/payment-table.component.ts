import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  output
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaymentDto } from '../../api/openapi';
import { CurrentUserDirective } from '../../shared/current-user.directive';
import { LoadingMaskComponent } from '../../shared/loading/loading-mask/loading-mask.component';
import { ScrollWrapperDirective } from '../../shared/scroll-wrapper.directive';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { DatePipe, NgClass } from '@angular/common';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { BadgeType } from '../../shared/badge/badge-type';
import { isPast } from 'date-fns';
import { RelativizeDatePipe } from '../../shared/pipes/relativize-date.pipe';

@Component({
  selector: 'hop-payment-table',
  imports: [
    LoadingMaskComponent,
    MatTableModule,
    MatSortModule,
    CurrentUserDirective,
    ScrollWrapperDirective,
    MatIcon,
    MatButton,
    PenaltyWithUnitComponent,
    DatePipe,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatFormField,
    MatIconButton,
    FormsModule,
    MatTooltip,
    NgClass,
    BadgeComponent,
    RelativizeDatePipe
  ],
  templateUrl: './payment-table.component.html',
  styleUrl: './payment-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentTableComponent {

  data = input<PaymentDto[], PaymentDto[] | null>([], {
    transform: (value: PaymentDto[] | null) => !!value ? value : []
  });
  loading = input<boolean, boolean | null>(false, {
    transform: (value: boolean | null) => !!value
  });

  unconfirmedPaymentsExist = computed(() => {
    return this.data()?.length && this.data().filter(payment => !payment.confirmed).length;
  });

  onConfirmation = output<PaymentDto>();
  onConfirmationAll = output<PaymentDto[]>();
  onUnconfirmation = output<PaymentDto>();

  displayedColumns: string[] = ['name', 'penaltyValue', 'outstandingValue', 'confirmed', 'confirmedAt', 'dueDate', 'actions'];
  dataSource: MatTableDataSource<PaymentDto> = new MatTableDataSource();

  protected readonly BadgeType = BadgeType;
  protected readonly isPast = isPast;

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
      this.cdr.markForCheck();
    });
  }

  confirm(payment: PaymentDto): void {
    this.onConfirmation.emit(payment);
  }

  confirmAll(): void {
    this.onConfirmationAll.emit(this.data().filter(item => !item.confirmed));
  }

  unconfirm(payment: PaymentDto): void {
    this.onUnconfirmation.emit(payment);
  }
}
