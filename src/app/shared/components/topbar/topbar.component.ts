import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left Section -->
        <div class="flex items-center space-x-4">
          <button 
            (click)="layoutService.toggleSidebar()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          
          <div class="flex items-center space-x-3">
            <img src="assets/pdo-logo.png" alt="PDO" class="h-8 w-auto" />
            <div>
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Digital Centre of Excellence</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">DCoE Dashboard - September 2025</p>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button 
            (click)="layoutService.toggleDarkMode()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle dark mode"
          >
            <svg *ngIf="!(layoutService.darkMode$ | async)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            <svg *ngIf="layoutService.darkMode$ | async" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </button>

          <!-- User Profile -->
          <div class="flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ (authService.currentUser$ | async)?.displayName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ (authService.currentUser$ | async)?.isLeader ? 'Leader' : 'User' }}
              </p>
            </div>
            
            <div class="relative">
              <button 
                (click)="toggleUserMenu()"
                class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="User menu"
              >
                <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
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