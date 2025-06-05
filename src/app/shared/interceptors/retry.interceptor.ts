import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, retry, timer } from 'rxjs';

export function retryInterceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: any) => {
        if (
          error instanceof HttpErrorResponse
          && [401, 403, 404].includes(error.status)
        ) {
          // do not retry in case of auth issues or not found endpoints
          return EMPTY;
        }
        return timer(1000);
      }
    })
  );
}
