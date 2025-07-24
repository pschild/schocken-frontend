import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { QrCodeDto, WhatsAppClientStatusDto, WhatsappService } from '../api/openapi';
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

  private whatsappService = inject(WhatsappService);

  pollingInterval$: Observable<number> = timer(0, 5000).pipe(share());

  lastUpdate$: Observable<Date> = this.pollingInterval$.pipe(map(() => new Date()));

  whatsappClientStatus$: Observable<WhatsAppClientStatusDto> = this.pollingInterval$.pipe(
    switchMap(() => this.whatsappService.getClientStatus())
  );

  whatsappLatestQrCode$: Observable<QrCodeDto | null> = this.pollingInterval$.pipe(
    switchMap(() => this.whatsappService.latestQrCode())
  );

  ngOnInit(): void {
  }

  initializeWaClient(): void {
    this.whatsappService.initialize().subscribe();
  }

  purgeWaClient(): void {
    this.whatsappService.purge().subscribe();
  }

}
