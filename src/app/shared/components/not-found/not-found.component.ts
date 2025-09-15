import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="max-w-md w-full text-center">
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a routerLink="/dashboard" class="btn-primary">
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent { }