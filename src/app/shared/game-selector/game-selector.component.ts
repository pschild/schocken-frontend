import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  effect,
  inject,
  input,
  output,
  signal,
  TemplateRef
} from '@angular/core';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { GameWithId } from './model/game-with-id.model';

@Component({
  selector: 'hop-game-selector',
  imports: [
    MatButtonModule,
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    AsyncPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSelectorComponent {

  games = input<GameWithId[], GameWithId[] | null>([], {
    transform: (value: GameWithId[] | null) => !!value ? value : []
  });

  currentIndex = computed(() => {
    return signal(this.games() && this.games().length > 0 ? this.games().length - 1 : 0);
  });

  @ContentChild('optionLabel') optionLabel!: TemplateRef<any>;

  private breakpointObserver = inject(BreakpointObserver);

  onSelectionChange = output<string>();

  isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
    map(state => state.matches)
  );

  constructor() {
    effect(() => {
      this.onSelectionChange.emit(this.games()[this.currentIndex()()]?.id ?? null);
    });
  }

  selectPrevious(): void {
    this.currentIndex().update(idx => Math.max(0, idx - 1));
  }

  selectNext(): void {
    this.currentIndex().update(idx => Math.min(this.games().length - 1, idx + 1));
  }

  onSelectionChanged($event: MatSelectChange) {
    this.currentIndex().set($event.value);
  }

}
