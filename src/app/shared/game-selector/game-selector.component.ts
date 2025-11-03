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
import { GameIdentifierModel } from './model/game-identifier.model';
import { groupBy } from 'lodash';
import { getYear } from 'date-fns';

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

  games = input<GameIdentifierModel[], GameIdentifierModel[] | null>([], {
    transform: (value: GameIdentifierModel[] | null) => !!value ? value : []
  });

  optionGroups = computed(() => {
    return Object.entries(groupBy<GameIdentifierModel>(this.games(), game => getYear(game.datetime)))
      .map(([key, value]) => ({ year: key, games: value }));
  });

  selectedValue = signal<string | null>(null);

  disableFirstAndPrevious = computed(() => {
    return this.getSelectedIndex() === 0;
  });

  disableLastAndNext = computed(() => {
    return this.getSelectedIndex() === this.games().length - 1;
  });

  @ContentChild('optionLabel') optionLabel!: TemplateRef<any>;

  private breakpointObserver = inject(BreakpointObserver);

  onSelectionChange = output<string>();

  isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
    map(state => state.matches)
  );

  constructor() {
    effect(() => {
      this.selectedValue.set(this.games()[this.games().length - 1]?.id);
    });

    effect(() => {
      if (!!this.selectedValue()) {
        this.onSelectionChange.emit(this.selectedValue()!);
      }
    });
  }

  selectFirst(): void {
    this.selectedValue.set(this.games()[0]?.id);
  }

  selectPrevious(): void {
    const selectedIndex = this.getSelectedIndex();
    if (selectedIndex > 0) {
      this.selectedValue.set(this.games()[selectedIndex - 1]?.id);
    }
  }

  selectNext(): void {
    const selectedIndex = this.getSelectedIndex();
    if (selectedIndex < this.games().length - 1) {
      this.selectedValue.set(this.games()[selectedIndex + 1]?.id);
    }
  }

  selectLast(): void {
    this.selectedValue.set(this.games()[this.games().length - 1]?.id);
  }

  private getSelectedIndex(): number {
    return this.games().findIndex(game => game.id === this.selectedValue());
  }

  onSelectionChanged($event: MatSelectChange) {
    this.selectedValue.set($event.value);
  }

}
