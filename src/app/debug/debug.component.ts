import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PwaUpdateCheckService } from '../shared/pwa-update-check.service';
import { PushNotificationService } from '../api/openapi';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'hop-debug',
  imports: [
    MatButton
  ],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugComponent {

  sendResults = signal<number>(0);

  pwaUpdateCheckService = inject(PwaUpdateCheckService);
  private pushNotificationService = inject(PushNotificationService);

  sendMessage(): void {
    this.pushNotificationService.send().subscribe(sendResults => this.sendResults.set(sendResults.length));
  }

}
