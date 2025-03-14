import { Directive, effect, ElementRef, inject, input, InputSignal } from '@angular/core';
import { CURRENT_PLAYER_ID } from './config.service';

@Directive({
  standalone: true,
  selector: '[hopCurrentUser]',
})
export class CurrentUserDirective {

  hopCurrentUser: InputSignal<string> = input('');

  private currentPlayerId: string = inject(CURRENT_PLAYER_ID);

  constructor(private el: ElementRef) {
    effect(() => {
      if (this.hopCurrentUser() === this.currentPlayerId) {
        this.el.nativeElement.classList.add('text-highlight');
      } else {
        this.el.nativeElement.classList.remove('text-highlight');
      }
    });
  }

}
