import { Routes } from '@angular/router';
import { TeamListComponent } from './teams-list.component';

export const teamsRoutes: Routes = [
  {
    path: '',
    component: TeamListComponent,
    title: 'Teams - DCoE'
  }
];