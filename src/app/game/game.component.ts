import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hop-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {

}
