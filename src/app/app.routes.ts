import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { AboutComponent } from './about/about.component';
import { EventTypeAdministrationComponent } from './administration/event-type-administration/event-type-administration.component';
import { PlayerAdministrationComponent } from './administration/player-administration/player-administration.component';
import { Role } from './auth/model/role.enum';
import { PermissionsService } from './auth/permissions.service';
import { ConstitutionComponent } from './constitution/constitution.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StatisticsComponent } from './statistics/statistics.component';

const roleGuardFn: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  return inject(PermissionsService).hasRole((route.data as any).requiredRole);
};

const permissionGuardFn: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  return inject(PermissionsService).hasPermission((route.data as any).requiredPermission);
};

const permissionsGuardFn: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  return inject(PermissionsService).hasAllPermissions((route.data as any).requiredPermissions);
};

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuardFn]
  },
  {
    path: 'game/:id',
    component: GameComponent,
    canActivate: [authGuardFn]
  },
  {
    path: 'administration',
    children: [
      { path: '', redirectTo: '/administration/player', pathMatch: 'full' },
      { path: 'player', component: PlayerAdministrationComponent },
      { path: 'event-type', component: EventTypeAdministrationComponent },
    ],
    data: {
      requiredRole: Role.ADMIN
    },
    canActivate: [authGuardFn, roleGuardFn]
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [authGuardFn]
  },
  {
    path: 'constitution',
    component: ConstitutionComponent,
    canActivate: [authGuardFn]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '',
    redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];
