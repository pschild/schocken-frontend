/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GameDto } from '../../models/game-dto';

export interface FindOne_2$Params {
  id: string;
}

export function findOne_2(http: HttpClient, rootUrl: string, params: FindOne_2$Params, context?: HttpContext): Observable<StrictHttpResponse<GameDto>> {
  const rb = new RequestBuilder(rootUrl, findOne_2.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GameDto>;
    })
  );
}

findOne_2.PATH = '/game/{id}';