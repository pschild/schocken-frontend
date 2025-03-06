import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DecodedJwt {
  permissions: string[];
  ['hoptimisten/roles']: string[];
}

export const decodeJwt = (source$: Observable<string>): Observable<DecodedJwt> => {
  return source$.pipe(
    map(accessToken => jwtDecode<DecodedJwt>(accessToken))
  );
};
