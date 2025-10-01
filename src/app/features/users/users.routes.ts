import { Routes } from '@angular/router';
import { UserListComponent } from './users-list.component';

export const usersRoutes: Routes = [
  {
    path: '',
    component: UserListComponent,
    title: 'Users - DCoE'
  }
];