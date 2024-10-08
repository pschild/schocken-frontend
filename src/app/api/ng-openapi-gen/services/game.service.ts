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

import { complete } from '../fn/game/complete';
import { Complete$Params } from '../fn/game/complete';
import { create_2 } from '../fn/game/create-2';
import { Create_2$Params } from '../fn/game/create-2';
import { findAll_2 } from '../fn/game/find-all-2';
import { FindAll_2$Params } from '../fn/game/find-all-2';
import { findOne_2 } from '../fn/game/find-one-2';
import { FindOne_2$Params } from '../fn/game/find-one-2';
import { GameDetailDto } from '../models/game-detail-dto';
import { GameDto } from '../models/game-dto';
import { getDetails_1 } from '../fn/game/get-details-1';
import { GetDetails_1$Params } from '../fn/game/get-details-1';
import { remove_2 } from '../fn/game/remove-2';
import { Remove_2$Params } from '../fn/game/remove-2';
import { update_2 } from '../fn/game/update-2';
import { Update_2$Params } from '../fn/game/update-2';

@Injectable({ providedIn: 'root' })
export class GameService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `findAll_2()` */
  static readonly FindAll_2Path = '/game';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAll_2()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll_2$Response(params?: FindAll_2$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<GameDto>>> {
    return findAll_2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAll_2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll_2(params?: FindAll_2$Params, context?: HttpContext): Observable<Array<GameDto>> {
    return this.findAll_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<GameDto>>): Array<GameDto> => r.body)
    );
  }

  /** Path part for operation `create_2()` */
  static readonly Create_2Path = '/game';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create_2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create_2$Response(params: Create_2$Params, context?: HttpContext): Observable<StrictHttpResponse<GameDto>> {
    return create_2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `create_2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create_2(params: Create_2$Params, context?: HttpContext): Observable<GameDto> {
    return this.create_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<GameDto>): GameDto => r.body)
    );
  }

  /** Path part for operation `findOne_2()` */
  static readonly FindOne_2Path = '/game/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findOne_2()` instead.
   *
   * This method doesn't expect any request body.
   */
  findOne_2$Response(params: FindOne_2$Params, context?: HttpContext): Observable<StrictHttpResponse<GameDto>> {
    return findOne_2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findOne_2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findOne_2(params: FindOne_2$Params, context?: HttpContext): Observable<GameDto> {
    return this.findOne_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<GameDto>): GameDto => r.body)
    );
  }

  /** Path part for operation `remove_2()` */
  static readonly Remove_2Path = '/game/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `remove_2()` instead.
   *
   * This method doesn't expect any request body.
   */
  remove_2$Response(params: Remove_2$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return remove_2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `remove_2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  remove_2(params: Remove_2$Params, context?: HttpContext): Observable<string> {
    return this.remove_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `update_2()` */
  static readonly Update_2Path = '/game/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `update_2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update_2$Response(params: Update_2$Params, context?: HttpContext): Observable<StrictHttpResponse<GameDto>> {
    return update_2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `update_2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update_2(params: Update_2$Params, context?: HttpContext): Observable<GameDto> {
    return this.update_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<GameDto>): GameDto => r.body)
    );
  }

  /** Path part for operation `getDetails_1()` */
  static readonly GetDetails_1Path = '/game/{id}/details';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDetails_1()` instead.
   *
   * This method doesn't expect any request body.
   */
  getDetails_1$Response(params: GetDetails_1$Params, context?: HttpContext): Observable<StrictHttpResponse<GameDetailDto>> {
    return getDetails_1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getDetails_1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getDetails_1(params: GetDetails_1$Params, context?: HttpContext): Observable<GameDetailDto> {
    return this.getDetails_1$Response(params, context).pipe(
      map((r: StrictHttpResponse<GameDetailDto>): GameDetailDto => r.body)
    );
  }

  /** Path part for operation `complete()` */
  static readonly CompletePath = '/game/{id}/complete';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `complete()` instead.
   *
   * This method doesn't expect any request body.
   */
  complete$Response(params: Complete$Params, context?: HttpContext): Observable<StrictHttpResponse<GameDto>> {
    return complete(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `complete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  complete(params: Complete$Params, context?: HttpContext): Observable<GameDto> {
    return this.complete$Response(params, context).pipe(
      map((r: StrictHttpResponse<GameDto>): GameDto => r.body)
    );
  }

}
