import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { PwaUpdateCheckService } from '../shared/pwa-update-check.service';
import {
  PushNotificationService,
  QrCodeDto,
  WhatsAppClientLogHistoryDto,
  WhatsAppClientStatusDto,
  WhatsappService
} from '../api/openapi';
import { Observable, share, switchMap, timer } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { jwtDecode } from 'jwt-decode';
import { format } from 'date-fns';
import { db } from '../offline/db';

@Component({
  selector: 'hop-debug',
  imports: [
    MatExpansionModule,
    MatButton,
    AsyncPipe,
    DatePipe,
    MatIcon,
    JsonPipe,
  ],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugComponent implements OnInit {

  // push
  sendResults = signal<number>(0);
  pwaUpdateCheckService = inject(PwaUpdateCheckService);
  private pushNotificationService = inject(PushNotificationService);

  // whats-app
  private whatsappService = inject(WhatsappService);
  pollingInterval$: Observable<number> = timer(0, 500000).pipe(share());
  lastUpdate$: Observable<Date> = this.pollingInterval$.pipe(map(() => new Date()));

  whatsappClientStatus$: Observable<WhatsAppClientStatusDto> = this.pollingInterval$.pipe(
    switchMap(() => this.whatsappService.getClientStatus())
  );

  whatsappClientLogs$: Observable<WhatsAppClientLogHistoryDto[]> = this.pollingInterval$.pipe(
    switchMap(() => this.whatsappService.getLogHistory())
  );

  whatsappLatestQrCode$: Observable<QrCodeDto | null> = this.pollingInterval$.pipe(
    switchMap(() => this.whatsappService.latestQrCode())
  );

  localStorageInfo: unknown;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    setTimeout(() => {
      let idToken, accessToken, refreshToken;

      Object.keys({...localStorage}).forEach(key => {
        const item = localStorage.getItem(key)!;
        if (key.includes('@@auth0spajs@@')) {
          if (key.includes('@@user@@')) {
            const parsed = JSON.parse(item);
            idToken = {
              token: this.shorten(parsed.id_token),
              iat: this.f(parsed.decodedToken.claims.iat),
              exp: this.f(parsed.decodedToken.claims.exp),
              nickname: parsed.decodedToken.claims.nickname,
              name: parsed.decodedToken.claims.name,
              sub: parsed.decodedToken.claims.sub,
            };
          } else {
            const parsed = JSON.parse(item);
            refreshToken = this.shorten(parsed.body.refresh_token);

            if (parsed.body.access_token) {
              const decoded = jwtDecode(parsed.body.access_token);
              accessToken = {
                token: this.shorten(parsed.body.access_token),
                iat: this.f(decoded.iat!),
                exp: this.f(decoded.exp!),
                // @ts-ignore
                permissions: decoded['permissions'].length,
                // @ts-ignore
                roles: decoded['hoptimisten/roles'].length
              };
            }
          }
        }
      });
      this.localStorageInfo = {accessToken, refreshToken, idToken};
      this.cdr.detectChanges();
    }, 500);

    // db.todoItems.add({ title: 'yyy' });
    // db.cacheItems.upsert('x', { payload: { hello: `world@${new Date().getTime()}` } }).then(console.log).catch(console.error);

    // db.cacheItems.get('0b4e99bf-d8f0-4b16-add5-ad75aec668f1').then(console.log);
  }

  // push
  sendMessage(): void {
    this.pushNotificationService.send().subscribe(sendResults => this.sendResults.set(sendResults.length));
  }

  // whats-app
  initializeWaClient(): void {
    this.whatsappService.initialize().subscribe();
  }

  purgeWaClient(): void {
    this.whatsappService.purge().subscribe();
  }

  private f(ts: number): string {
    return format(new Date(ts * 1000), 'yyyy-MM-dd HH:mm:ss');
  }

  private shorten(token: string): string {
    return token.substring(0, 10) + '...' + token.substring(token.length - 10);
  }

}
