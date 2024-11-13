import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationStart, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { MenuItem, MenuItemComponent } from './menu-item/menu-item.component';

@Component({
  selector: 'hop-navigation',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MenuItemComponent, AsyncPipe],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {

  readonly destroyRef = inject(DestroyRef);
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly router = inject(Router);

  @ViewChild('snav') private snav!: MatSidenav;

  isMobile$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
    map(state => state.matches),
    takeUntilDestroyed(this.destroyRef)
  );

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
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      switchMap(() => this.isMobile$),
      filter(isMobile => isMobile),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.snav.close());
  }
}
