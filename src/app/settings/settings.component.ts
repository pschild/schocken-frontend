import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SwPush } from '@angular/service-worker';
import { catchError, EMPTY, Observable, of, switchMap, tap, throwError, withLatestFrom } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { SuccessMessageService } from '../shared/success-message.service';
import { PushSubscriptionService } from '../shared/push-subscription.service';
import { SubscriptionDeniedByUserError } from '../error/subscription-denied-by-user.error';
import { SettingsState } from './settings.state';

@Component({
  selector: 'hop-settings',
  imports: [
    MatSlideToggle,
    ReactiveFormsModule,
    AsyncPipe,
    MatIcon,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  private swPush = inject(SwPush);
  private successMessageService = inject(SuccessMessageService);
  pushSubscriptionService = inject(PushSubscriptionService);

  private settingsState = inject(SettingsState);

  form = new FormGroup({
    enablePushNotifications: new FormControl<boolean>(false),
  });

  deviceSubscription$: Observable<PushSubscription | null> = this.swPush.subscription;

  update$: Observable<unknown> = this.form.valueChanges.pipe(
    tap(formValue => this.settingsState.update(formValue)),
    takeUntilDestroyed(this.destroyRef),
  );

  register$: Observable<PushSubscription | null> = this.pushSubscriptionService.register().pipe(
    catchError(err => {
      if (err instanceof SubscriptionDeniedByUserError) {
        this.settingsState.update({...this.form.value, enablePushNotifications: false});
        return of(null);
      }
      return throwError(() => err);
    }),
    tap(() => this.successMessageService.showSuccess('Du erhältst jetzt Push-Nachrichten!')),
  );

  enablePushNotificationChange$: Observable<PushSubscription | null | void> = this.form.controls.enablePushNotifications.valueChanges.pipe(
    withLatestFrom(this.deviceSubscription$),
    switchMap(([value, subscription]) => {
      if (value === true && !subscription) {
        return this.register$;
      } else if (!value && !!subscription) {
        return this.pushSubscriptionService.unregister(subscription);
      }
      return EMPTY;
    }),
    takeUntilDestroyed(this.destroyRef),
  );

  ngOnInit() {
    this.settingsState.userSettings$.subscribe(console.log);

    this.pushSubscriptionService.permission.pipe(
      tap(permission => {
        if (permission !== 'granted') {
          if (permission === 'denied') {
            this.form.controls.enablePushNotifications.disable({ emitEvent: false });
          }

          this.settingsState.update({...this.form.value, enablePushNotifications: false});
        }
      }),
    ).subscribe();

    this.enablePushNotificationChange$.subscribe();
    this.update$.subscribe();

    this.settingsState.userSettings$.subscribe(userSettings => {
      this.form.patchValue({
        enablePushNotifications: userSettings?.enablePushNotifications,
      }, {emitEvent: false});
    });
  }
}
