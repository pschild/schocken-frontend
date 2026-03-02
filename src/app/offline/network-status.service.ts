import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  public online$: Observable<boolean>;

  constructor() {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    );
  }

  public getOnlineEvent$(): Observable<Event> {
    return fromEvent(window, 'online');
  }

  public getOfflineEvent$(): Observable<Event> {
    return fromEvent(window, 'offline');
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }
}
