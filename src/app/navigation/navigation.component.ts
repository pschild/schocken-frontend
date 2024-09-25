import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuItem, MenuItemComponent } from './menu-item/menu-item.component';

@Component({
  selector: 'hop-navigation',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MenuItemComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  navigationItems: MenuItem[] = [
    { label: 'Spiele', icon: 'casino', url: 'home' },
    {
      label: 'Verwaltung',
      icon: 'settings',
      subItems: [
        { label: 'Spieler', icon: 'people', url: 'administration/player' },
        { label: 'Ereignisse', icon: 'euro_symbol', url: 'administration/event-type' },
      ]
    },
    { label: 'Statistiken', icon: 'bar_chart', url: 'statistics' },
    { label: 'Satzung', icon: 'menu_book', url: 'constitution' },
    { label: 'Über', icon: 'info', url: 'about' },
  ];

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
