import { inject, Injectable } from '@angular/core';
import { StateService } from '../shared/state.service';
import { AuthService } from '@auth0/auth0-angular';
import { UserSettingsDto, UserSettingsService } from '../api/openapi';
import { Observable, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface ISettingsState {
  userSettings: UserSettingsDto | null;
}

const initialState: ISettingsState = {
  userSettings: null,
}

@Injectable({
  providedIn: 'root',
})
export class SettingsState extends StateService<ISettingsState> {

  private auth = inject(AuthService);
  private userSettingsService = inject(UserSettingsService);

  private currentUserId$: Observable<string> = this.auth.user$.pipe(
    map(user => user?.sub),
    filter(Boolean)
  );

  userSettings$: Observable<UserSettingsDto | null> = this.select(state => state.userSettings);

  constructor() {
    super(initialState);
  }

  load(): void {
    this.currentUserId$.pipe(
      switchMap(userId => this.userSettingsService.findByUserId(userId)),
    ).subscribe(userSettings => this.setState({ userSettings }));
  }

  update(settingsForm: Partial<{ enablePushNotifications: boolean | null }>): void {
    this.currentUserId$.pipe(
      switchMap((userId: string) => this.userSettingsService.createOrUpdate({
          auth0UserId: userId,
          enablePushNotifications: settingsForm.enablePushNotifications === true
        })
      )
    ).subscribe(userSettings => this.setState({ userSettings }));
  }

}
