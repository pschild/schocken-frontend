import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingState } from './loading.state';

@Pipe({
  name: 'isLoading',
  standalone: true
})
export class IsLoadingPipe implements PipeTransform {

  private loadingState = inject(LoadingState);

  transform(flag: string): Observable<boolean> {
    return this.loadingState.isLoading(flag);
  }

}
