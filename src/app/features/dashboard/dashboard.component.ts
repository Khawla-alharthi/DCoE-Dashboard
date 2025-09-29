import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner.component';
import { ThemeToggleComponent } from '../../shared/components/ui/theme-toggle.component';
import { DashboardService, DashboardStats } from '../../data-access/services/api/dashboard-api.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ThemeToggleComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-wrapper">
        <app-loading-spinner />
      </div>
      
      <div *ngIf="!loading" class="dashboard-content">
        <!-- Header -->
        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Overview</h1>
          </div>
          <div class="header-right">
            <button (click)="refreshDashboard()" class="icon-btn" title="Refresh">
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            <app-theme-toggle />
          </div>
        </div>

        <!-- Overview Cards -->
        <div class="metrics-grid">
          <div class="metric-card blue" (click)="openMetricDetails('products')">
            <div class="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-label">Total Products</div>
              <div class="metric-value">{{ stats.totalProducts }}</div>
            </div>
          </div>

          <div class="metric-card green" (click)="openMetricDetails('value')">
            <div class="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-label">Value Generated</div>
              <div class="metric-value">{{ formatCurrency(stats.valueGenerated) }}</div>
            </div>
          </div>

          <div class="metric-card orange" (click)="openMetricDetails('percentage')">
            <div class="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-label">Actual %</div>
              <div class="metric-value">{{ stats.actualPercentage }}%</div>
            </div>
          </div>

          <div class="metric-card red" (click)="openMetricDetails('engagements')">
            <div class="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-label">External Engagements</div>
              <div class="metric-value">{{ stats.externalEngagements }}</div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="quick-links-section">
          <h2 class="section-title">Quick Access</h2>
          <div class="quick-links-grid">
            <a routerLink="/programs" class="quick-link-card">
              <div class="quick-link-icon blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="quick-link-content">
                <h3>Digital Ambition Programs</h3>
                <p>View program status and progress</p>
              </div>
            </a>

            <a routerLink="/rpa-projects" class="quick-link-card">
              <div class="quick-link-icon green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div class="quick-link-content">
                <h3>RPA Summary</h3>
                <p>Review automation projects and metrics</p>
              </div>
            </a>

            <a routerLink="/ide-highlights" class="quick-link-card">
              <div class="quick-link-icon purple">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="quick-link-content">
                <h3>IDE Highlights</h3>
                <p>View team achievements and contributions</p>
              </div>
            </a>

            <a routerLink="/capability-development" class="quick-link-card">
              <div class="quick-link-icon yellow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div class="quick-link-content">
                <h3>Capability Development</h3>
                <p>Track training and development programs</p>
              </div>
            </a>

            <a routerLink="/recognition" class="quick-link-card">
              <div class="quick-link-icon red">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div class="quick-link-content">
                <h3>Recognition & Awards</h3>
                <p>Acknowledge outstanding contributions</p>
              </div>
            </a>

            <a routerLink="/team-activities" class="quick-link-card">
              <div class="quick-link-icon teal">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="quick-link-content">
                <h3>Team Building Activities</h3>
                <p>View upcoming team events and activities</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  loading = true;
  stats: DashboardStats = {
    totalProducts: 37,
    valueGenerated: 7970000,
    actualPercentage: 81,
    externalEngagements: 9,
    liveProcesses: 109,
    inDevelopment: 14,
    planned: 8,
    manhourSavings: 23300,
    robots: 4
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
      }
    });
  }

  openMetricDetails(type: string): void {
    this.notificationService.showInfo('Metric Details', `Opening details for ${type} metrics`);
  }

  refreshDashboard(): void {
    this.loadDashboardData();
    this.notificationService.showSuccess('Dashboard Refreshed', 'Data has been updated successfully');
  }

  formatCurrency(value: number): string {
    return `$${(value / 1000000).toFixed(2)}M`;
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}