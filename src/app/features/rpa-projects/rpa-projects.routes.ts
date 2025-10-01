import { Routes } from '@angular/router';
import { RpaListComponent } from './pages/rpa-list/rpa-list.component';
import { RpaFormComponent } from './pages/rpa-form/rpa-form.component';

export const rpaProjectsRoutes: Routes = [
  {
    path: '',
    component: RpaListComponent,
    title: 'RPA Projects - DCoE'
  },
  {
    path: 'create',
    component: RpaFormComponent,
    title: 'Create RPA Project - DCoE'
  },
  {
    path: 'edit/:id',
    component: RpaFormComponent,
    title: 'Edit RPA Project - DCoE'
  }
];