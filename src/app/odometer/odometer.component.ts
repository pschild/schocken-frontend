import { CommonModule } from '@angular/common';
import { Component, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, switchMap, takeWhile, tap, timer, map } from 'rxjs';

@Component({
  selector: 'hop-odometer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odometer.component.html',
  styleUrl: './odometer.component.scss'
})
export class OdometerComponent implements OnInit, OnChanges  {

  private COUNT_INTERVAL_MS = 50;
  private DURATION = 500;

  countTo = input.required<number>();
  precision = input(0);
  type = input<'number' | 'currency'>('number');
  showAverage = input(false);

  targetValue$: ReplaySubject<number> = new ReplaySubject(1);
  currentValue$: Observable<string> | undefined;
  tempValue$: BehaviorSubject<number> = new BehaviorSubject(0);

  get precisionExpr(): string {
    return '1.' + this.precision();
  }

  ngOnInit(): void {
    this.currentValue$ = this.targetValue$.pipe(
      switchMap(targetValue => timer(0, this.COUNT_INTERVAL_MS).pipe(
        map(timerValue => this.tempValue$.value + timerValue * ((targetValue - this.tempValue$.value) / (this.DURATION / this.COUNT_INTERVAL_MS))),
        takeWhile(currentValue => currentValue !== targetValue, true),
        tap(v => this.tempValue$.next(v)),
        map(currentValue => this.type() === 'currency' ? currentValue.toFixed(2) : currentValue.toFixed(this.precision())),
      )),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      typeof changes['countTo'].currentValue !== 'undefined'
      && !isNaN(changes['countTo'].currentValue)
    ) {
      this.targetValue$.next(+changes['countTo'].currentValue);
    } else {
      this.targetValue$.next(0);
    }
  }

}
