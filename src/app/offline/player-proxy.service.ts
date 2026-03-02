import { inject, Injectable } from '@angular/core';
import {
  Configuration,
  CreatePlayerDto,
  PlayerDto,
  PlayerService,
  PlayerServiceInterface,
  UpdatePlayerDto
} from '../api/openapi';
import { iif, Observable, of, tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// TODO: OfflineAware...Service implements ...ServiceInterface, OfflineAware
export class PlayerProxyService implements PlayerServiceInterface {

  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  private httpService = inject(PlayerService);

  create(createPlayerDto: CreatePlayerDto, extraHttpRequestParams?: any): Observable<PlayerDto> {
    return this.httpService.create(createPlayerDto);
  }

  findAll(extraHttpRequestParams?: any): Observable<Array<PlayerDto>> {
    return this.httpService.findAll();
  }

  findOne(id: string, extraHttpRequestParams?: any): Observable<PlayerDto> {
    return this.httpService.findOne(id);
  }

  getPlayerByUserId(id: string, extraHttpRequestParams?: any): Observable<PlayerDto> {
    if (navigator.onLine) {
      return this.httpService.getPlayerByUserId(id).pipe(
        tap(response => localStorage.setItem(`player:getPlayerByUserId`, JSON.stringify({ datetime: new Date(), response })))
      );
    }
    return of(JSON.parse(localStorage.getItem(`player:getPlayerByUserId`)!).response);
  }

  remove(id: string, extraHttpRequestParams?: any): Observable<string> {
    return this.httpService.remove(id);
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto, extraHttpRequestParams?: any): Observable<PlayerDto> {
    return this.httpService.update(id, updatePlayerDto);
  }
}
