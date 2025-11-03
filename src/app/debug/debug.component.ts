import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
import { AsyncPipe, DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'hop-debug',
  imports: [
    MatExpansionModule,
    MatButton,
    AsyncPipe,
    DatePipe,
    MatIcon,
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
  pollingInterval$: Observable<number> = timer(0, 5000).pipe(share());
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

  ngOnInit(): void {
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

}
