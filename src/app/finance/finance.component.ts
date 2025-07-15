import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, of, Subject } from 'rxjs';
import { PaymentDto, PaymentService, StatisticsService } from '../api/openapi';
import { doWithLoading } from '../shared/operators';
import { LoadingState } from '../shared/loading/loading.state';
import { PaymentTableComponent } from './payment-table/payment-table.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { IsLoadingPipe } from '../shared/loading/is-loading.pipe';
import { GameSelectorComponent } from '../shared/game-selector/game-selector.component';
import { filter, switchMap, tap } from 'rxjs/operators';
import { GameWithId } from '../shared/game-selector/model/game-with-id.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SuccessMessageService } from '../shared/success-message.service';

@Component({
  selector: 'hop-finance',
  imports: [
    PaymentTableComponent,
    AsyncPipe,
    IsLoadingPipe,
    GameSelectorComponent,
    DatePipe,
  ],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceComponent implements OnInit {

  private statisticsService = inject(StatisticsService);
  private paymentService = inject(PaymentService);
  private loadingState = inject(LoadingState);
  private successMessageService = inject(SuccessMessageService);

  allGames$: Observable<GameWithId[]> = this.statisticsService.allGames();

  selectedGameId$: Subject<string> = new Subject();

  loadPayments$: Observable<PaymentDto[]> = this.selectedGameId$.pipe(
    filter(Boolean),
    switchMap(gameId => this.paymentService.getByGameId(gameId).pipe(
      doWithLoading(this.loadingState, 'payments'),
    )),
  );

  paymentsState$: BehaviorSubject<PaymentDto[]> = new BehaviorSubject<PaymentDto[]>([]);

  ngOnInit(): void {
    this.loadPayments$.subscribe(payments => this.paymentsState$.next(payments));
  }

  handleGameChanged(gameId: string): void {
    this.selectedGameId$.next(gameId);
  }

  confirm(payment: PaymentDto): void {
    this.updatePayment(payment, true);
  }

  unconfirm(payment: PaymentDto): void {
    this.updatePayment(payment, false);
  }

  updatePayment(payment: PaymentDto, confirmed: boolean): void {
    this.paymentService.update(payment.id, {...payment, confirmed}).pipe(
      tap(updatedPayment => this.updateStateItem(updatedPayment)),
      tap(() => this.successMessageService.showSuccess(`Eintrag aktualisiert`)),
    ).subscribe();
  }

  confirmAll(payments: PaymentDto[]): void {
    forkJoin(
      payments.map(payment => this.paymentService.update(payment.id, {...payment, confirmed: true}).pipe(
        catchError(err => of(err))
      ))
    ).pipe(
      tap((results: Array<PaymentDto | HttpErrorResponse>) => {
        const successResponses = results.filter(responseItem => !(responseItem instanceof HttpErrorResponse));
        successResponses.map(updatedPayment => this.updateStateItem(updatedPayment as PaymentDto));

        // re-throw all caught errors of forkJoin
        const errorResponses = results.filter(responseItem => responseItem instanceof HttpErrorResponse);
        errorResponses.map(error => {
          throw error;
        });
      }),
      tap(() => this.successMessageService.showSuccess(`Einträge aktualisiert`)),
    ).subscribe();
  }

  private updateStateItem(updatedPayment: PaymentDto): void {
    this.paymentsState$.next(
      this.paymentsState$.value.map(payment => payment.id === updatedPayment.id ? updatedPayment : payment)
    );
  }

}
