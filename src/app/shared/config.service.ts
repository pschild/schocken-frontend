import { Injectable, InjectionToken } from '@angular/core';
import { PlayerDto } from '../api/openapi';

export const CURRENT_PLAYER_ID = new InjectionToken<string>('current-player-id');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _currentPlayer: PlayerDto | null = null;

  constructor() {}

  setCurrentPlayer(id: PlayerDto | null) {
    this._currentPlayer = id;
  }

  getCurrentPlayerId(): string | null {
    return this._currentPlayer?.id || null;
  }

  getCurrentPlayerName(): string | null {
    return this._currentPlayer?.name || null;
  }
}
