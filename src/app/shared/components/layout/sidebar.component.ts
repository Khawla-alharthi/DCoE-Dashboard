import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoleService } from '../../../core/services/role.service';
import { LayoutService } from '../../../core/services/layout.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  requiredPermission?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside 
      *ngIf="layoutService.sidebarOpen$ | async"
      class="sidebar"
      [class.sidebar-mobile]="isMobile()"
    >
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of getVisibleNavItems()" class="nav-item">
            <a 
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: false}"
              class="nav-link"
              (click)="onNavClick()"
            >
              <span [innerHTML]="item.icon" class="nav-icon"></span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: #ffffff;
      height: 100%;
      border-right: 1px solid #e5e5ea;
      overflow-y: auto;
      transition: transform 0.3s ease;
      
      @media (max-width: 1023px) {
        position: fixed;
        left: 0;
        top: 65px;
        bottom: 0;
        z-index: 40;
        box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
      }
    }
    
    .dark .sidebar {
      background: #2a2a2c;
      border-right-color: #3a3a3c;
    }
    
    .sidebar-nav {
      padding: 1rem;
    }
    
    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .nav-item {
      margin: 0;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      color: #1d1d1f;
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 500;
      transition: all 0.2s;
      
      &:hover {
        background: #f5f5f7;
      }
      
      &.active {
        background: #007aff;
        color: #ffffff;
        
        :deep(.nav-icon svg) {
          color: #ffffff;
        }
      }
    }
    
    .dark .nav-link {
      color: #f5f5f7;
      
      &:hover {
        background: #3a3a3c;
      }
      
      &.active {
        background: #0a84ff;
        color: #ffffff;
      }
    }
    
    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      
      :deep(svg) {
        width: 100%;
        height: 100%;
        color: #86868b;
        transition: color 0.2s;
      }
    }
    
    .dark .nav-icon :deep(svg) {
      color: #98989d;
    }
    
    .nav-link:hover .nav-icon :deep(svg) {
      color: #1d1d1f;
    }
    
    .dark .nav-link:hover .nav-icon :deep(svg) {
      color: #f5f5f7;
    }
    
    .nav-label {
      flex: 1;
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);
  roleService = inject(RoleService);
  layoutService = inject(LayoutService);

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>`,
      route: '/dashboard'
    },
    {
      label: 'Capability Development',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>`,
      route: '/capability-development'
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
      route: '/programs',
      requiredPermission: 'canManagePrograms'
    },
    {
      label: 'Teams',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>`,
      route: '/teams',
      requiredPermission: 'canManageTeams'
    },
    {
      label: 'Users',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>`,
      route: '/users',
      requiredPermission: 'canManageUsers'
    },
    {
      label: 'Recognition',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>`,
      route: '/recognition',
      requiredPermission: 'canManageRecognition'
    }
  ];

  getVisibleNavItems(): NavItem[] {
    return this.navItems.filter(item => {
      if (!item.requiredPermission) {
        return true;
      }
      return this.roleService.hasPermission(item.requiredPermission as any);
    });
  }

  isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  onNavClick(): void {
    if (this.isMobile()) {
      this.layoutService.setSidebarOpen(false);
    }
  }
}