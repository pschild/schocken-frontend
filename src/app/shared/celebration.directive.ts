import { Directive, HostListener } from '@angular/core';
import confetti from 'canvas-confetti';

@Directive({
  standalone: true,
  selector: '[hopCelebration]',
})
export class CelebrationDirective {

  @HostListener('click', ['$event'])
  onClick($event: PointerEvent){
    confetti({
      shapes: ['circle'],
      particleCount: this.randomIntBetween(200, 300),
      startVelocity: this.randomIntBetween(40, 80),
      spread: this.randomIntBetween(100, 150),
      angle: this.randomIntBetween(45, 135),
      zIndex: 1001,
      origin: {
        x: $event.x / window.innerWidth,
        y: $event.y / window.innerHeight
      }
    });
  }

  private randomIntBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
