import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <img src="assets/pdo-logo.png" alt="PDO" class="mx-auto h-12 w-auto" />
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Digital Centre of Excellence
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access the DCoE Dashboard
          </p>
        </div>

        <!-- Login Card -->
        <div class="card p-8">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Use your corporate credentials to access the dashboard
            </p>
          </div>

          <!-- SSO Login Button -->
          <button
            (click)="loginWithSSO()"
            [disabled]="isLoading"
            class="w-full btn-primary justify-center flex items-center"
          >
            <svg 
              *ngIf="!isLoading" 
              class="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <svg 
              *ngIf="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Sign in with SSO' }}
          </button>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Demo Mode
                </span>
              </div>
            </div>

            <!-- Demo Login Buttons -->
            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                (click)="demoLogin('leader')"
                [disabled]="isLoading"
                class="btn-secondary justify-center flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
                Demo Leader
              </button>
              <button
                (click)="demoLogin('user')"
                [disabled]="isLoading"
                class="btn-secondary justify-center flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Demo User
              </button>
            </div>

            <!-- Demo Credentials Info -->
            <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">Demo Credentials:</p>
              <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                <strong>Leader:</strong> demo.leader / password<br>
                <strong>User:</strong> demo.user / password
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Petroleum Development Oman. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  isLoading = false;

  constructor() {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  loginWithSSO(): void {
    this.isLoading = true;
    this.authService.loginWithSSO().subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.notificationService.showSuccess('Welcome!', 'Successfully signed in');
          this.router.navigate(['/dashboard']);
        } else {
          this.notificationService.showError('Login Failed', 'SSO login is not configured yet. Please use demo login.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Login Error', 'Failed to sign in. Please try again.');
        console.error('SSO Login Error:', error);
      }
    });
  }

  demoLogin(role: 'leader' | 'user'): void {
    this.isLoading = true;
    
    const credentials = {
      username: role === 'leader' ? 'demo.leader' : 'demo.user',
      password: 'password'
    };

    this.authService.login(credentials).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          const user = this.authService.getCurrentUser();
          this.notificationService.showSuccess(
            'Welcome!', 
            `Successfully signed in as ${user?.displayName}`
          );
          this.router.navigate(['/dashboard']);
        } else {
          this.notificationService.showError(
            'Login Failed', 
            'Invalid credentials. Please try again.'
          );
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError(
          'Login Error', 
          'An error occurred during login. Please try again.'
        );
        console.error('Demo Login Error:', error);
      }
    });
  }
}