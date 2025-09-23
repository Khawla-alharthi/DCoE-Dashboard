import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Auth routes with auth layout (no sidebar/topbar)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth-routing.module').then(r => r.authRoutes)
      }
    ]
  },

  // Main app routes with main layout (sidebar/topbar)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(c => c.DashboardComponent),
        title: 'Dashboard - DCoE'
      },
      
      {
        path: 'capability-development',
        loadComponent: () => import('./features/capability-development/capability-development.component')
          .then(c => c.CapabilityDevelopmentComponent),
        title: 'Capability Development - DCoE'
      },
      
      {
        path: 'rpa-projects',
        loadChildren: () => import('./features/rpa-projects/rpa-projects.routes')
          .then(r => r.rpaProjectsRoutes)
      },
      
      {
        path: 'programs',
        loadChildren: () => import('./features/programs/programs.routes')
          .then(r => r.programsRoutes),
        canActivate: [RoleGuard],
        data: { requiredPermission: 'canManagePrograms' }
      },
      
      {
        path: 'teams',
        loadChildren: () => import('./features/teams/teams.routes')
          .then(r => r.teamsRoutes),
        canActivate: [RoleGuard],
        data: { requiredPermission: 'canManageTeams' }
      },
      
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes')
          .then(r => r.usersRoutes),
        canActivate: [RoleGuard],
        data: { requiredPermission: 'canManageUsers' }
      },
      
      {
        path: 'recognition',
        loadChildren: () => import('./features/recognition-awards/recognition-awards.routes')
          .then(r => r.recognitionRoutes),
        canActivate: [RoleGuard],
        data: { requiredPermission: 'canManageRecognition' }
      }
    ]
  },

  // Error routes with auth layout
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '404',
        loadComponent: () => import('./shared/components/not-found/not-found.component')
          .then(c => c.NotFoundComponent),
        title: '404 - Page Not Found'
      },
      {
        path: '403',
        loadComponent: () => import('./shared/components/forbidden/forbidden.component')
          .then(c => c.ForbiddenComponent),
        title: '403 - Access Denied'
      }
    ]
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/404'
  }
];