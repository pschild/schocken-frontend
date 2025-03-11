import { Injectable, InjectionToken } from '@angular/core';

export const CURRENT_PLAYER_ID = new InjectionToken<string>('current-player-id');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _currentPlayerId: string | null = null;

  constructor() {}

  setCurrentPlayerId(id: string | null) {
    this._currentPlayerId = id;
  }

  getCurrentPlayerId(): string | null {
    return this._currentPlayerId;
  }
}
