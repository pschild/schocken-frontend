/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RoundDto } from '../../models/round-dto';
import { UpdateAttendanceDto } from '../../models/update-attendance-dto';

export interface UpdateAttendees$Params {
  id: string;
      body: UpdateAttendanceDto
}

export function updateAttendees(http: HttpClient, rootUrl: string, params: UpdateAttendees$Params, context?: HttpContext): Observable<StrictHttpResponse<RoundDto>> {
  const rb = new RequestBuilder(rootUrl, updateAttendees.PATH, 'patch');
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

updateAttendees.PATH = '/round/{id}/attendees';
