import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingState {

  private activeFlags$ = new BehaviorSubject<string[]>([]);

  constructor() {
  }

  startLoading(flag: string): void {
    this.activeFlags$.next([...this.activeFlags$.value, flag]);
  }

  stopLoading(flag: string): void {
    this.activeFlags$.next(this.activeFlags$.value.filter(activeFlag => activeFlag !== flag));
  }

  isLoading(flag: string): Observable<boolean> {
    return this.activeFlags$.pipe(
      map(activeFlags => activeFlags.includes(flag))
    );
  }

}
