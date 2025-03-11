import { Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { CURRENT_PLAYER_ID } from './config.service';

@Directive({
  standalone: true,
  selector: '[hopCurrentUser]',
})
export class CurrentUserDirective implements OnInit {

  @Input() hopCurrentUser!: string;

  private currentPlayerId: string = inject(CURRENT_PLAYER_ID);

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (this.hopCurrentUser === this.currentPlayerId) {
      this.el.nativeElement.classList.add('text-highlight');
    }
  }

}
