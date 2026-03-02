import { booleanAttribute, Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';
import { NetworkStatusService } from '../offline/network-status.service';

@Directive({
  standalone: true,
  selector: '[hopDisabledWhenOffline]',
})
export class DisabledWhenOfflineDirective {

  @Input({transform: booleanAttribute}) hopDisabledWhenOffline: boolean = true;

  private network = inject(NetworkStatusService);

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.network.online$.subscribe(online => {
      if (!online && this.hopDisabledWhenOffline) {
        this.el.nativeElement.classList.add('disabled-due-to-offline');
        this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
      } else {
        this.el.nativeElement.classList.remove('disabled-due-to-offline');
        this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
      }
    });
  }
}
