import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner.component';
import { ThemeToggleComponent } from '../../shared/components/ui/theme-toggle.component';
import { DashboardService, DashboardStats } from '../../data-access/services/api/dashboard-api.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Program } from '../../data-access/models/program.model';
import { IdeHighlight } from '../../data-access/models/ide-highlight.model';
import { TeamActivity } from '../../data-access/models/team-activity.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ThemeToggleComponent,
    BaseChartDirective
  ],
  template: `
    <div class="dashboard-container">
      <!-- Loading State -->
      <app-loading-spinner *ngIf="loading" />
      
      <div *ngIf="!loading" class="dashboard-content">
        <!-- Header Section -->
        <div class="dashboard-header">
          <div class="header-content">
            <div class="brand-section">
              <div class="pdo-logo">
                <span class="logo-text">PDO</span>
              </div>
              <div class="title-section">
                <h1 class="main-title">Digital Centre of Excellence</h1>
                <p class="subtitle">DCoE Dashboard - August 2025</p>
              </div>
            </div>
            
            <div class="header-actions">
              <button (click)="refreshDashboard()" class="refresh-btn">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Refresh
              </button>
              <app-theme-toggle />
            </div>
          </div>
        </div>

        <!-- Overview Metrics -->
        <div class="overview-section">
          <div class="metrics-grid">
            <div class="metric-card blue" (click)="openMetricDetails('products')">
              <div class="metric-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ stats.totalProducts }}</div>
                <div class="metric-title">Total Products</div>
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
                <div class="metric-value">{{ formatCurrency(stats.valueGenerated) }}</div>
                <div class="metric-title">Value Generated</div>
                <div class="metric-trend">+12%</div>
              </div>
            </div>

            <div class="metric-card yellow" (click)="openMetricDetails('percentage')">
              <div class="metric-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ stats.actualPercentage }}%</div>
                <div class="metric-title">Actual %</div>
                <div class="metric-trend">+5%</div>
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
                <div class="metric-value">{{ stats.externalEngagements }}</div>
                <div class="metric-title">External Engagements</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Digital Ambition Program -->
        <div class="digital-ambition-section">
          <div class="section-card">
            <div class="section-header">
              <div class="header-info">
                <h3 class="section-title">
                  <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Digital Ambition Program
                </h3>
                <p class="section-subtitle">Program Status Overview</p>
              </div>
            </div>
            
            <div class="section-content">
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Program Name</th>
                      <th>Phase</th>
                      <th>Comments</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let program of digitalPrograms" (click)="viewProgram(program)">
                      <td>{{ program.programName }}</td>
                      <td>{{ program.phase }}</td>
                      <td>{{ program.comments }}</td>
                      <td>
                        <span class="status-badge" [ngClass]="getStatusBadgeClass(program.status)">
                          {{ program.status }}
                        </span>
                      </td>
                      <td>
                        <button class="action-btn action-view" (click)="viewProgram(program); $event.stopPropagation()">
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- RPA Summary -->
        <div class="rpa-summary-section">
          <h2 class="section-main-title">RPA Summary</h2>
          
          <div class="rpa-metrics-grid">
            <div class="metric-card green">
              <div class="metric-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ stats.liveProcesses }}</div>
                <div class="metric-title">Live Processes</div>
              </div>
            </div>

            <div class="metric-card yellow">
              <div class="metric-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ stats.inDevelopment }}</div>
                <div class="metric-title">In Development</div>
              </div>
            </div>

            <div class="metric-card blue">
              <div class="metric-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ stats.planned }}</div>
                <div class="metric-title">Planned</div>
              </div>
            </div>

            <div class="metric-card green">
              <div class="metric-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ formatCurrencyShort(stats.valueGenerated) }}</div>
                <div class="metric-title">Value Generated</div>
              </div>
            </div>

            <div class="metric-card purple">
              <div class="metric-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ formatNumber(stats.manhourSavings) }}</div>
                <div class="metric-title">Manhour Savings</div>
              </div>
            </div>

            <div class="metric-card red">
              <div class="metric-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ stats.robots }}</div>
                <div class="metric-title">Robots</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="charts-grid">
            <!-- Dollar Savings Chart -->
            <div class="chart-card">
              <div class="chart-header">
                <h3 class="chart-title">
                  <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  Dollar Savings by Directorate
                </h3>
              </div>
              <div class="chart-content">
                <div class="chart-wrapper">
                  <canvas baseChart
                    [data]="dollarSavingsChartData"
                    [options]="dollarSavingsChartOptions"
                    type="bar">
                  </canvas>
                </div>
                <div class="chart-summary">
                  <div class="total-value">{{ formatCurrencyShort(11500000) }}</div>
                  <div class="total-label">Total</div>
                </div>
              </div>
            </div>

            <!-- Project Status Chart -->
            <div class="chart-card">
              <div class="chart-header">
                <h3 class="chart-title">
                  <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                  </svg>
                  Project Status by Directorate
                </h3>
              </div>
              <div class="chart-content">
                <div class="chart-wrapper">
                  <canvas baseChart
                    [data]="projectStatusChartData"
                    [options]="projectStatusChartOptions"
                    type="bar">
                  </canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recognition & Awards -->
        <div class="recognition-section">
          <div class="section-card">
            <div class="section-header">
              <div class="header-info">
                <h3 class="section-title">
                  <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                  Recognition & Awards
                </h3>
                <p class="section-subtitle">Outstanding team contributions</p>
              </div>
              <a routerLink="/recognition" class="view-all-link">
                View All →
              </a>
            </div>
            
            <div class="section-content">
              <div class="recognition-card">
                <div class="recognition-avatar">
                  <span class="avatar-text">IA</span>
                </div>
                <div class="recognition-info">
                  <h4 class="recipient-name">Istabraq Al Ruhaili</h4>
                  <p class="recipient-team">🏆 Team</p>
                  <p class="recognition-category">AI Guidance - OQ Engagements</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- IDE Highlights -->
        <div class="ide-highlights-section">
          <div class="section-card">
            <div class="section-header">
              <div class="header-info">
                <h3 class="section-title">
                  <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  IDE Highlights
                </h3>
              </div>
              <a routerLink="/ide-highlights" class="view-all-link">
                View All →
              </a>
            </div>
            
            <div class="section-content">
              <div class="highlights-grid">
                <div *ngFor="let highlight of ideHighlights" 
                     class="highlight-item"
                     (click)="openHighlightModal(highlight)">
                  <div class="highlight-indicator"></div>
                  <div class="highlight-content">
                    <h4 class="highlight-title">{{ highlight.highlightTitle }}</h4>
                    <svg class="highlight-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Building Activities -->
        <div class="team-activities-section">
          <div class="section-card">
            <div class="section-header">
              <div class="header-info">
                <h3 class="section-title">
                  <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17 20h5v-2a3 3 0 00-5.356-1.
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

  digitalPrograms: Program[] = [];
  ideHighlights: IdeHighlight[] = [];
  teamActivities: TeamActivity[] = [];

  // Chart configurations
  dollarSavingsChartData: ChartConfiguration['data'] = {
    labels: ['CP', 'EVD', 'Finance', 'HSE', 'IDC', 'IDD', 'ISGL', 'OSD', 'Petroleum', 'UWD'],
    datasets: [{
      label: 'Dollar Savings',
      data: [2.5, 1.8, 2.2, 1.5, 0.8, 1.2, 0.5, 1.0, 0.7, 0.3],
      backgroundColor: 'rgba(34, 197, 94, 0.8)'
    }]
  };

  dollarSavingsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)'
        }
      },
      x: {
        ticks: {
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      }
    }
  };

  projectStatusChartData: ChartConfiguration['data'] = {
    labels: ['CP', 'EVD', 'Finance', 'HSE', 'IDC', 'IDD', 'ISGL', 'OSD', 'Petroleum', 'UWD'],
    datasets: [
      {
        label: 'Development',
        data: [3, 5, 4, 3, 2, 1, 2, 3, 1, 2],
        backgroundColor: 'rgba(251, 191, 36, 0.8)'
      },
      {
        label: 'Planning',
        data: [2, 3, 2, 1, 1, 2, 1, 2, 1, 1],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Production',
        data: [5, 12, 11, 3, 3, 21, 3, 7, 2, 9],
        backgroundColor: 'rgba(34, 197, 94, 0.8)'
      },
      {
        label: 'Under Discussion',
        data: [1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        backgroundColor: 'rgba(168, 85, 247, 0.8)'
      }
    ]
  };

  projectStatusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6b7280',
          usePointStyle: true,
          padding: 15
        }
      }
    },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)'
        }
      },
      x: {
        stacked: true,
        ticks: {
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      }
    }
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

    this.dashboardService.getDigitalPrograms().subscribe({
      next: (programs) => {
        this.digitalPrograms = programs;
      },
      error: (error) => {
        console.error('Error loading programs:', error);
      }
    });

    this.dashboardService.getIdeHighlights().subscribe({
      next: (highlights) => {
        this.ideHighlights = highlights;
      },
      error: (error) => {
        console.error('Error loading highlights:', error);
      }
    });

    this.dashboardService.getTeamActivities().subscribe({
      next: (activities) => {
        this.teamActivities = activities;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
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

  formatCurrencyShort(value: number): string {
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'On Track': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Delayed by 20%': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'At Risk': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  viewProgram(program: Program): void {
    this.notificationService.showInfo('Program Details', `Viewing ${program.programName}`);
  }

  openHighlightModal(highlight: IdeHighlight): void {
    this.notificationService.showInfo('Highlight Details', highlight.highlightTitle);
  }

  openActivityModal(activity: TeamActivity): void {
    this.notificationService.showInfo('Activity Details', activity.activityName);
  }

  openAddActivityModal(): void {
    this.notificationService.showInfo('Add Activity', 'Add activity functionality');
  }
}