import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoleService } from '../../../core/services/role.service';
import { ThemeToggleComponent } from '../ui/theme-toggle.component';

interface NavItem {
  label: string;
  route: string;
  requiredPermission?: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  template: `
    <header class="topbar">
      <div class="topbar-content">
        <!-- Left Section - Logo and Brand -->
        <div class="topbar-left">
          <div class="brand" [routerLink]="'/dashboard'" style="cursor: pointer;">
            <div class="logo">
              <span class="logo-text">PDO</span>
            </div>
            <div class="brand-text">
              <h1 class="brand-title">Digital Centre of Excellence</h1>
              <p class="brand-subtitle">DCoE Dashboard</p>
            </div>
          </div>
        </div>

        <!-- Center Navigation -->
        <nav class="topbar-nav">
          <a 
            *ngFor="let item of getVisibleNavItems()"
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
            class="nav-link"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- Right Section -->
        <div class="topbar-right">
          <!-- Theme Toggle -->
          <app-theme-toggle />

          <!-- User Profile -->
          <div class="user-section">
            <div class="user-info">
              <p class="user-name">{{ (authService.currentUser$ | async)?.displayName || 'Demo User' }}</p>
              <p class="user-role">{{ (authService.currentUser$ | async)?.isLeader ? 'Team Leader' : 'Team Member' }}</p>
            </div>
            
            <div class="user-menu-wrapper">
              <button 
                (click)="toggleUserMenu()"
                class="user-btn"
                aria-label="User menu"
              >
                <div class="avatar">{{ getUserInitials() }}</div>
                <svg class="chevron" [class.rotate]="showUserMenu" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div *ngIf="showUserMenu" class="user-dropdown">
                <button class="dropdown-item">
                  <svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Profile
                </button>
                <button class="dropdown-item">
                  <svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Settings
                </button>
                <div class="dropdown-divider"></div>
                <button (click)="logout()" class="dropdown-item danger">
                  <svg class="item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      background: #ffffff;
      border-bottom: 1px solid #e5e5ea;
      height: 65px;
      position: sticky;
      top: 0;
      z-index: 50;
      
      .dark & {
        background: #2a2a2c;
        border-bottom-color: #3a3a3c;
      }
    }
    
    .topbar-content {
      height: 100%;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1600px;
      margin: 0 auto;
      gap: 2rem;
    }
    
    .topbar-left {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      @media (max-width: 768px) {
        .brand-text {
          display: none;
        }
      }
    }
    
    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .logo-text {
      color: #ffffff;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: -0.5px;
    }
    
    .brand-text {
      .brand-title {
        font-size: 1rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0;
        line-height: 1.2;
        white-space: nowrap;
        
        .dark & {
          color: #f5f5f7;
        }
      }
      
      .brand-subtitle {
        font-size: 0.75rem;
        color: #86868b;
        margin: 0;
        line-height: 1.2;
        
        .dark & {
          color: #98989d;
        }
      }
    }
    
    .topbar-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      justify-content: center;
      overflow-x: auto;
      
      @media (max-width: 1200px) {
        display: none;
      }
    }
    
    .nav-link {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1d1d1f;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.2s;
      
      &:hover {
        background: #f5f5f7;
      }
      
      &.active {
        background: #007aff;
        color: #ffffff;
      }
      
      .dark & {
        color: #f5f5f7;
        
        &:hover {
          background: #3a3a3c;
        }
        
        &.active {
          background: #0a84ff;
        }
      }
    }
    
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }
    
    .user-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .user-info {
      text-align: right;
      
      @media (max-width: 640px) {
        display: none;
      }
      
      .user-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0;
        line-height: 1.2;
        
        .dark & {
          color: #f5f5f7;
        }
      }
      
      .user-role {
        font-size: 0.75rem;
        color: #86868b;
        margin: 0;
        line-height: 1.2;
        
        .dark & {
          color: #98989d;
        }
      }
    }
    
    .user-menu-wrapper {
      position: relative;
    }
    
    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 10px;
      transition: background 0.2s;
      
      &:hover {
        background: #f5f5f7;
      }
      
      .dark & {
        &:hover {
          background: #3a3a3c;
        }
      }
    }
    
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #007aff 0%, #5856d6 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    .chevron {
      width: 16px;
      height: 16px;
      color: #86868b;
      transition: transform 0.2s;
      
      .dark & {
        color: #98989d;
      }
      
      &.rotate {
        transform: rotate(180deg);
      }
    }
    
    .user-dropdown {
      position: absolute;
      right: 0;
      top: calc(100% + 0.5rem);
      background: #ffffff;
      border: 1px solid #e5e5ea;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      min-width: 200px;
      padding: 0.5rem;
      z-index: 100;
      animation: fadeIn 0.2s ease;
      
      .dark & {
        background: #2a2a2c;
        border-color: #3a3a3c;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem;
      border: none;
      background: transparent;
      border-radius: 8px;
      color: #1d1d1f;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      text-align: left;
      
      &:hover {
        background: #f5f5f7;
      }
      
      &.danger {
        color: #ff3b30;
        
        .item-icon {
          color: #ff3b30;
        }
      }
      
      .dark & {
        color: #f5f5f7;
        
        &:hover {
          background: #3a3a3c;
        }
        
        &.danger {
          color: #ff453a;
          
          .item-icon {
            color: #ff453a;
          }
        }
      }
    }
    
    .item-icon {
      width: 18px;
      height: 18px;
      color: #86868b;
      flex-shrink: 0;
      
      .dark & {
        color: #98989d;
      }
    }
    
    .dropdown-divider {
      height: 1px;
      background: #e5e5ea;
      margin: 0.5rem 0;
      
      .dark & {
        background: #3a3a3c;
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class TopbarComponent {
  authService = inject(AuthService);
  roleService = inject(RoleService);
  showUserMenu = false;

  navItems: NavItem[] = [
    { label: 'Overview', route: '/dashboard' },
    { label: 'Programs', route: '/programs', requiredPermission: 'canManagePrograms' },
    { label: 'RPA Projects', route: '/rpa-projects' },
    { label: 'Highlights', route: '/ide-highlights' },
    { label: 'Capability', route: '/capability-development' },
    { label: 'Recognition', route: '/recognition', requiredPermission: 'canManageRecognition' },
    { label: 'Activities', route: '/team-activities' },
    { label: 'Teams', route: '/teams', requiredPermission: 'canManageTeams' },
    { label: 'Users', route: '/users', requiredPermission: 'canManageUsers' }
  ];

  getVisibleNavItems(): NavItem[] {
    return this.navItems.filter(item => {
      if (!item.requiredPermission) {
        return true;
      }
      return this.roleService.hasPermission(item.requiredPermission as any);
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (!user?.displayName) return 'U';
    
    const names = user.displayName.split(' ');
    return names.length > 1 
      ? (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
      : names[0].charAt(0).toUpperCase();
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.showUserMenu = false;
    }
  }
}