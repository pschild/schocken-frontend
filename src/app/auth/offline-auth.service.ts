import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import * as jose from 'jose';

@Injectable({
  providedIn: 'root'
})
export class OfflineAuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_profile';

  constructor(private auth: AuthService) {
  }

  async saveTokens(): Promise<void> {
    this.auth.getAccessTokenSilently().subscribe(token => {
      localStorage.setItem(this.TOKEN_KEY, token);

      this.auth.user$.subscribe(user => {
        if (user) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
      });
    });
  }

  isTokenValidOffline(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (!token) {
      return false;
    }

    try {
      const decoded = jose.decodeJwt(token);

      if (decoded.exp) {
        const expirationDate = new Date(decoded.exp * 1000);
        return expirationDate > new Date();
      }

      return false;
    } catch (error) {
      console.error('Token-Validierung fehlgeschlagen', error);
      return false;
    }
  }

  getOfflineUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async isAuthenticated(): Promise<boolean> {
    if (this.isOnline()) {
      return new Promise(resolve => {
        this.auth.isAuthenticated$.subscribe(isAuth => {
          if (isAuth) {
            this.saveTokens();
          }
          resolve(isAuth);
        });
      });
    } else {
      return this.isTokenValidOffline();
    }
  }
}
