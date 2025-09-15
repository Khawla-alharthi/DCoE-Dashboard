import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  leaderOnly?: boolean;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside 
      *ngIf="layoutService.sidebarOpen$ | async"
      class="w-64 bg-white dark:bg-gray-800 h-full shadow-lg border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
    >
      <nav class="p-4">
        <ul class="space-y-2">
          <li *ngFor="let item of getVisibleNavItems()" class="relative">
            <a 
              [routerLink]="item.route"
              routerLinkActive="bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 border-r-2 border-primary-500"
              class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <span [innerHTML]="item.icon" class="w-5 h-5 mr-3"></span>
              {{ item.label }}
            </a>
            
            <!-- Sub-navigation (if needed) -->
            <ul *ngIf="item.children" class="ml-8 mt-2 space-y-1">
              <li *ngFor="let child of item.children">
                <a 
                  [routerLink]="child.route"
                  routerLinkActive="text-primary-600 dark:text-primary-400"
                  class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {{ child.label }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  authService = inject(AuthService);
  layoutService = inject(LayoutService);

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"/>
      </svg>`,
      route: '/dashboard'
    },
    {
      label: 'RPA Projects',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
      </svg>`,
      route: '/rpa-projects'
    },
    {
      label: 'Programs',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>`,
      route: '/programs'
    },
    {
      label: 'Teams',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>`,
      route: '/teams'
    },
    {
      label: 'Users',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>`,
      route: '/users',
      leaderOnly: true
    },
    {
      label: 'Recognition & Awards',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>`,
      route: '/recognition'
    }
  ];

  getVisibleNavItems(): NavItem[] {
    const isLeader = this.authService.isLeader();
    return this.navItems.filter(item => !item.leaderOnly || isLeader);
  }
}