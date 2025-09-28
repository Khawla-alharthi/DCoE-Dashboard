import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { ThemeToggleComponent } from '../ui/theme-toggle.component';
import { RoleToggleComponent } from '../ui/role-toggle.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent, RoleToggleComponent],
  template: `
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left Section -->
        <div class="flex items-center space-x-4">
          <button 
            (click)="layoutService.toggleSidebar()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          
          <!-- PDO Logo and Title -->
          <div class="flex items-center space-x-3">
            <!-- PDO Logo -->
            <div class="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
              <span class="text-white font-bold text-lg">PDO</span>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Digital Centre of Excellence</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">DCoE Dashboard - August 2025</p>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-6">
          <!-- Role Toggle (for demo) -->
          <app-role-toggle></app-role-toggle>
          
          <!-- Theme Toggle -->
          <app-theme-toggle></app-theme-toggle>

          <!-- User Profile -->
          <div class="flex items-center space-x-3">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ (authService.currentUser$ | async)?.displayName || 'Demo User' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ (authService.currentUser$ | async)?.isLeader ? 'Team Leader' : 'Team Member' }}
              </p>
            </div>
            
            <div class="relative">
              <button 
                (click)="toggleUserMenu()"
                class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="User menu"
              >
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                  {{ getUserInitials() }}
                </div>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div 
                *ngIf="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                <button 
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Profile
                </button>
                <button 
                  (click)="logout()"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  `
})
export class TopbarComponent {
  authService = inject(AuthService);
  layoutService = inject(LayoutService);
  showUserMenu = false;

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
    if (!target.closest('.relative')) {
      this.showUserMenu = false;
    }
  }
}