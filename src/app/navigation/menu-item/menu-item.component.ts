import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemIcon, MatListItemMeta, MatListItemTitle } from '@angular/material/list';
import { RouterLinkActive, RouterModule } from '@angular/router';

export interface MenuItem {
  label: string;
  icon: string;
  url?: string;
  role?: string;
  subItems?: MenuItem[];
}

@Component({
  selector: 'hop-menu-item',
  standalone: true,
  imports: [
    MatIcon,
    MatListItem,
    MatListItemIcon,
    MatListItemMeta,
    MatListItemTitle,
    RouterModule,
    RouterLinkActive
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
