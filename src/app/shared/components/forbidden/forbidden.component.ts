import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 text-center">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20">
          <svg class="h-12 w-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
          </svg>
        </div>

        <!-- Error Message -->
        <div class="space-y-4">
          <h1 class="text-6xl font-bold text-gray-200 dark:text-gray-700">403</h1>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            You don't have the required permissions to access this resource. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button 
            (click)="goBack()" 
            class="w-full btn-secondary justify-center flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Go Back
          </button>
          
          <a 
            routerLink="/dashboard" 
            class="w-full btn-primary justify-center flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Return to Dashboard
          </a>
        </div>

        <!-- Additional Info -->
        <div class="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-yellow-700 dark:text-yellow-200">
              If you need access to this resource, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForbiddenComponent {
  goBack(): void {
    window.history.back();
  }
}