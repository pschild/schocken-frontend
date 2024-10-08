/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RoundDto } from '../../models/round-dto';
import { UpdateRoundDto } from '../../models/update-round-dto';

export interface Update_1$Params {
  id: string;
      body: UpdateRoundDto
}

export function update_1(http: HttpClient, rootUrl: string, params: Update_1$Params, context?: HttpContext): Observable<StrictHttpResponse<RoundDto>> {
  const rb = new RequestBuilder(rootUrl, update_1.PATH, 'patch');
  if (params) {
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RoundDto>;
    })
  );
}

update_1.PATH = '/round/{id}';
