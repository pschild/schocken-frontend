import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { decodeJwt } from './jwt-decode.operator';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private readonly auth = inject(AuthService);

  hasRole(requiredRole: string): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      filter(Boolean),
      switchMap(() => this.auth.getAccessTokenSilently()),
      decodeJwt,
      map(jwt => jwt['hoptimisten/roles'].includes(requiredRole))
    );
  }

  hasAllPermissions(requiredPermissions: string[]): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      filter(Boolean),
      switchMap(() => this.auth.getAccessTokenSilently()),
      decodeJwt,
      map(({ permissions }) => requiredPermissions.every(permission => permissions.includes(permission)))
    );
  }

  hasPermission(requiredPermission: string): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      filter(Boolean),
      switchMap(() => this.auth.getAccessTokenSilently()),
      decodeJwt,
      map(({ permissions }) => permissions.includes(requiredPermission))
    );
  }
}
