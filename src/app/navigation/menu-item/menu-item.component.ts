import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemIcon, MatListItemMeta, MatListItemTitle } from '@angular/material/list';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { DisabledWhenOfflineDirective } from '../../shared/disabled-when-offline.directive';

export interface MenuItem {
  label: string;
  icon: string;
  url?: string;
  role?: string;
  subItems?: MenuItem[];
  disabledWhenOffline?: boolean;
}

@Component({
  selector: 'hop-menu-item',
  imports: [
    MatIcon,
    MatListItem,
    MatListItemIcon,
    MatListItemMeta,
    MatListItemTitle,
    RouterModule,
    RouterLinkActive,
    DisabledWhenOfflineDirective
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemComponent {

  item = input.required<MenuItem>();

  nestedMenuOpen = signal(false);

  toggleNested() {
    if (!this.item().subItems) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }

}
