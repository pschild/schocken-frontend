import { defer, finalize, Observable, Subject } from 'rxjs';
import { LoadingState } from './loading/loading.state';

export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
}

export function indicate<T>(indicator: Subject<boolean | string>, identifier?: string | null): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      prepare(() => indicator.next(!!identifier ? identifier : true)),
      finalize(() => indicator.next(!!identifier ? '' : false))
    );
}

export function doWithLoading<T>(loadingState: LoadingState, flag: string): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      loadingState.startLoading(flag);
      return source;
    }).pipe(
      finalize(() => loadingState.stopLoading(flag))
    );
}
