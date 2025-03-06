import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { decodeJwt } from './jwt-decode.operator';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private readonly auth = inject(AuthService);

  hasRole(requiredRole: string): Observable<boolean> {
    return this.auth.getAccessTokenSilently().pipe(
      decodeJwt,
      map(jwt => jwt['hoptimisten/roles'].includes(requiredRole))
    );
  }

  hasAllPermissions(requiredPermissions: string[]): Observable<boolean> {
    return this.auth.getAccessTokenSilently().pipe(
      decodeJwt,
      map(({ permissions }) => requiredPermissions.every(permission => permissions.includes(permission)))
    );
  }

  hasPermission(requiredPermission: string): Observable<boolean> {
    return this.auth.getAccessTokenSilently().pipe(
      decodeJwt,
      map(({ permissions }) => permissions.includes(requiredPermission))
    );
  }
}
