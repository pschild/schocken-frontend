/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { GameOverviewDto } from '../models/game-overview-dto';
import { getOverview } from '../fn/game-overview/get-overview';
import { GetOverview$Params } from '../fn/game-overview/get-overview';

@Injectable({ providedIn: 'root' })
export class GameOverviewService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getOverview()` */
  static readonly GetOverviewPath = '/game-overview';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOverview()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOverview$Response(params?: GetOverview$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<GameOverviewDto>>> {
    return getOverview(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getOverview$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getOverview(params?: GetOverview$Params, context?: HttpContext): Observable<Array<GameOverviewDto>> {
    return this.getOverview$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<GameOverviewDto>>): Array<GameOverviewDto> => r.body)
    );
  }

}
