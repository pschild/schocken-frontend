import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ConstitutionComponent } from './constitution/constitution.component';
import { EventTypeAdministrationComponent } from './administration/event-type-administration/event-type-administration.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlayerAdministrationComponent } from './administration/player-administration/player-administration.component';
import { StatisticsComponent } from './statistics/statistics.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'game/:id', component: GameComponent },
  {
    path: 'administration',
    children: [
      { path: '', redirectTo: '/administration/player', pathMatch: 'full' },
      { path: 'player', component: PlayerAdministrationComponent },
      { path: 'event-type', component: EventTypeAdministrationComponent },
    ]
  },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'constitution', component: ConstitutionComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
