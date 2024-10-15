import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class StateService<T> {
  private state$: BehaviorSubject<T>;

  protected get state(): T {
    return this.state$.getValue();
  }

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    );
  }

  public selectSnapshot<K>(mapFn: (state: T) => K): K {
    return mapFn(this.state$.getValue());
  }

  protected setState(newState: Partial<T>): void {
    this.state$.next({
      ...this.state,
      ...structuredClone(newState), // ensure immutability
    });
  }

}
