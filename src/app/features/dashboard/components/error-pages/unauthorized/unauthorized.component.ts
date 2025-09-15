import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full text-center">
        <div class="card p-8">
          <div class="text-center">
            <svg class="mx-auto h-24 w-24 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0h-2m-2-5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM12 9V7m0 0V5m0 2h2m-2 0H10"/>
            </svg>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
            <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Access Denied</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-8">
              You don't have permission to access this resource. Contact your administrator if you believe this is an error.
            </p>
            
            <div class="space-y-4">
              <a routerLink="/dashboard" class="btn-primary inline-flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Go to Dashboard
              </a>
              <button (click)="goBack()" class="btn-secondary ml-4">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {
  goBack(): void {
    window.history.back();
  }
}
