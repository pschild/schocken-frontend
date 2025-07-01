import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PushNotificationService, PushSubscriptionDto } from '../api/openapi';
import { SwPush } from '@angular/service-worker';
import { SubscriptionDeniedByUserError } from '../error/subscription-denied-by-user.error';

@Injectable({
  providedIn: 'root'
})
export class PushSubscriptionService {

  private swPush = inject(SwPush);
  private pushNotificationService = inject(PushNotificationService);

  permission$: Subject<NotificationPermission> = new BehaviorSubject(Notification.permission);

  get permission(): Observable<NotificationPermission> {
    return this.permission$.asObservable();
  }

  register(): Observable<PushSubscription> {
    return this.pushNotificationService.getPublicKey().pipe(
      switchMap(serverPublicKey => from(this.swPush.requestSubscription({serverPublicKey}))),
      catchError((err: Error) => {
        this.permission$.next(Notification.permission);
        if (Notification.permission === 'denied') { // clicked "deny" after being asked for permission
          return throwError(() => new SubscriptionDeniedByUserError(err.message));
        }
        return throwError(() => err);
      }),
      filter(Boolean),
      switchMap(subscription => this.pushNotificationService.subscribe(subscription.toJSON() as unknown as PushSubscriptionDto).pipe(
        tap(() => this.permission$.next(Notification.permission)),
        map(() => subscription),
      )),
    );
  }

  unregister(subscription: PushSubscription): Observable<void> {
    return this.pushNotificationService.unsubscribe(subscription.endpoint).pipe(
      switchMap(() => from(this.swPush.unsubscribe())),
    );
  }
}
