import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PwaUpdateCheckService } from '../shared/pwa-update-check.service';

@Component({
  selector: 'hop-debug',
  imports: [],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugComponent {

  pwaUpdateCheckService = inject(PwaUpdateCheckService);

}
