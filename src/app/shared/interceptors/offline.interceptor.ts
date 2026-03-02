import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { v4 } from 'uuid';
import { from, mergeMap, Observable, of, tap } from 'rxjs';
import { CacheItem, db } from '../../offline/db';
import { filter, map } from 'rxjs/operators';
import { CreateGameDto } from '../../api/openapi';

const writeCacheHandlerFn = (cacheKey: string, req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  return next(req).pipe(
    filter(response => response.type === HttpEventType.Response), // TODO: filter out Sent event globally
    mergeMap(response => from(db.cacheItems.upsert(cacheKey, { payload: response.body as object })).pipe(
      map(() => response),
    )),
  );
};

const readCacheHandlerFn = (cacheKey: string, req: HttpRequest<unknown>) => {
  return from(db.cacheItems.get(cacheKey)).pipe(
    map(cacheItem => cacheItem?.payload),
    map(body => new HttpResponse({ status: 200, body })),
  );
};

const urlMap: { method: string; urlPattern: RegExp; onlineHandlerFn?: Function; offlineHandlerFn: Function }[] = [
  {
    method: 'GET',
    urlPattern: /^\/api\/game-overview$/,
    onlineHandlerFn: (req: HttpRequest<unknown>, next: HttpHandlerFn) => writeCacheHandlerFn('games', req, next),
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => readCacheHandlerFn('games', req),
  },
  {
    method: 'GET',
    urlPattern: /^\/api\/player$/,
    onlineHandlerFn: (req: HttpRequest<unknown>, next: HttpHandlerFn) => writeCacheHandlerFn('players', req, next),
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => readCacheHandlerFn('players', req),
  },
  {
    method: 'GET',
    urlPattern: /^\/api\/event-type$/,
    onlineHandlerFn: (req: HttpRequest<unknown>, next: HttpHandlerFn) => writeCacheHandlerFn('event-types', req, next),
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => readCacheHandlerFn('event-types', req),
  },
  {
    method: 'GET',
    urlPattern: /^\/api\/player\/by-user-id\/(?<id>[^\/]+)$/,
    onlineHandlerFn: (req: HttpRequest<unknown>, next: HttpHandlerFn) => writeCacheHandlerFn('player-by-user-id', req, next),
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => {
      return from(db.cacheItems.get('player-by-user-id')).pipe(
        tap((cacheItem: CacheItem | undefined) => {
          if (cacheItem?.payload && (cacheItem.payload as { auth0UserId: string }).auth0UserId !== params!['id']) {
            throw new Error('The cached user info changed. Please go online, login and try again.');
          }
        }),
        map((cacheItem: CacheItem | undefined) => cacheItem?.payload),
        map(body => new HttpResponse({ status: 200, body })),
      );
    },
  },
  {
    method: 'GET',
    urlPattern: /^\/api\/user-settings\/(?<id>[^\/]+)$/,
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => {
      return of(new HttpResponse({
        status: 200,
        body: null
      }));
    },
  },
  {
    method: 'POST',
    urlPattern: /^\/api\/game-details$/,
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => {
      const uuid = v4();
      const body = req.body as CreateGameDto;
      return from(
        db.games.add({
          id: uuid,
          datetime: body.datetime || new Date().toISOString(),
          completed: body.completed || false,
          excludeFromStatistics: body.excludeFromStatistics || false,
          place: {
            type: body.placeType,
            hostedById: body.hostedById,
            locationLabel: body.placeType === CreateGameDto.PlaceTypeEnum.Away
              ? body.placeOfAwayGame
              : body.placeType === CreateGameDto.PlaceTypeEnum.Home
              ? 'einem Spieler' // TODO: Name aus Cache lesen
              : undefined,
          },
          events: [],
          penalties: []
        })
      ).pipe(
        map(() => new HttpResponse({ status: 201, body: { id: uuid } })),
      );
    },
  },
  {
    method: 'GET',
    urlPattern: /^\/api\/game-details\/(?<id>[^\/]+)$/,
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => {
      return from(db.games.get(params!['id'])).pipe(
        map(game => new HttpResponse({
          status: 200,
          body: game
        })),
      );
    },
  },
  {
    method: 'GET',
    urlPattern: /^\/api\/round-details\/(?<id>[^\/]+)$/,
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => {
      return of(new HttpResponse({
        status: 200,
        body: []
      }));
    },
  },
  {
    method: 'POST',
    urlPattern: /^\/api\/statistics\/live-game$/,
    offlineHandlerFn: (req: HttpRequest<unknown>, params: { [key: string]: string; } | undefined) => {
      return of(new HttpResponse({
        status: 200,
        body: null
      }));
    },
  },
];

export function offlineInterceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const routeConfig = urlMap
    .map(item => {
      const match = req.url.match(new RegExp(item.urlPattern));
      if (req.method === item.method && match) {
        let params;
        if (match.groups) {
          params = Object.fromEntries(
            Object.entries(match.groups).map(([key, value]) => [key, decodeURIComponent(value)])
          );
        }
        return { ...item, params };
      }
      return null;
    })
    .find(Boolean);

  console.log(req.url, navigator.onLine, routeConfig);

  if (routeConfig) {
    return navigator.onLine
      ? (routeConfig.onlineHandlerFn ? routeConfig.onlineHandlerFn(req, next) : next(req))
      : routeConfig.offlineHandlerFn(req, routeConfig.params)
    ;
  }

  console.warn(`none matching route ${req.method} ${req.url}`);

  return next(req);
}
