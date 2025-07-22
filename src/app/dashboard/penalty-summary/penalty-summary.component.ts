import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BadgeComponent } from '../../shared/badge/badge.component';
import { CelebrationDirective } from '../../shared/celebration.directive';
import { PenaltyWithUnitComponent } from '../../shared/penalty-with-unit/penalty-with-unit.component';
import { BadgeType } from '../../shared/badge/badge-type';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OutstandingPenaltyDto, UserPaymentService } from '../../api/openapi';
import { QrCodeDialogComponent } from '../qr-code-dialog/qr-code-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { doWithLoading } from '../../shared/operators';
import { map, shareReplay } from 'rxjs/operators';
import { LoadingState } from '../../shared/loading/loading.state';
import { IsLoadingPipe } from '../../shared/loading/is-loading.pipe';
import PenaltyUnitEnum = OutstandingPenaltyDto.PenaltyUnitEnum;

@Component({
  selector: 'hop-penalty-summary',
  imports: [
    AsyncPipe,
    BadgeComponent,
    CelebrationDirective,
    MatIcon,
    MatProgressSpinner,
    PenaltyWithUnitComponent,
    IsLoadingPipe,
    MatIconButton
  ],
  templateUrl: './penalty-summary.component.html',
  styleUrl: './penalty-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PenaltySummaryComponent {
  protected readonly BadgeType = BadgeType;

  private userPaymentService = inject(UserPaymentService);
  private loadingState = inject(LoadingState);
  private dialog = inject(MatDialog);

  summarizedPaymentsByPlayer$: Observable<OutstandingPenaltyDto[]> = this.userPaymentService.getOutstandingPenaltiesByUserId().pipe(
    doWithLoading(this.loadingState, 'summary'),
    shareReplay(1),
  );
  outstandingEuroPaymentByPlayer$: Observable<OutstandingPenaltyDto | undefined> = this.summarizedPaymentsByPlayer$.pipe(
    map(payments => payments.find(p => p.penaltyUnit === PenaltyUnitEnum.Euro)),
  );

  qrCode$: Observable<string> = this.userPaymentService.getQrCodeByUserId();

  showQrCode(penalty: OutstandingPenaltyDto): void {
    this.qrCode$.subscribe(qrCode => {
      this.dialog.open(QrCodeDialogComponent, {
        data: {
          qrCode,
          penalty: {
            value: penalty.outstandingValueSum,
            unit: penalty.penaltyUnit,
          }
        }
      });
    });
  }
}
