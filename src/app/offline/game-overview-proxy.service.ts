import { inject, Injectable } from '@angular/core';
import {
  Configuration,
  GameOverviewOfYearDto,
  GameOverviewService,
  GameOverviewServiceInterface
} from '../api/openapi';
import { Observable, of, tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// TODO: OfflineAware...Service implements ...ServiceInterface, OfflineAware
export class GameOverviewProxyService implements GameOverviewServiceInterface {

  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  private httpService = inject(GameOverviewService);

  getOverview(extraHttpRequestParams?: any): Observable<Array<GameOverviewOfYearDto>> {
    if (navigator.onLine) {
      return this.httpService.getOverview().pipe(
        tap(response => localStorage.setItem(`gameOverview:getOverview`, JSON.stringify({ datetime: new Date(), response })))
      );
    }
    return of(((JSON.parse(localStorage.getItem(`gameOverview:getOverview`)!).response) as GameOverviewOfYearDto[]).filter(x => x.year === '2025'));
  }

}
