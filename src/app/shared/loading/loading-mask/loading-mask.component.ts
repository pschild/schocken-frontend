import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'hop-loading-mask',
  standalone: true,
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './loading-mask.component.html',
  styleUrl: './loading-mask.component.scss'
})
export class LoadingMaskComponent {
}
