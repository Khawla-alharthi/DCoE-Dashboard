import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner.component';
import { ThemeToggleComponent } from '../../shared/components/ui/theme-toggle.component';
import { DashboardService, DashboardStats } from '../../data-access/services/api/dashboard-api.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Program } from '../../data-access/models/program.model';
import { TeamActivity } from '../../data-access/models/team-activity.model';
import { IdeHighlight } from '../../data-access/models/ide-highlight.model';

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

        <!-- Digital Ambition Program -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">Digital Ambition Program</h2>
            <p class="section-subtitle">Program Status Overview</p>
          </div>
          
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Program Name</th>
                  <th>Phase</th>
                  <th>Comments</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let program of digitalPrograms" (click)="viewProgram(program)">
                  <td><strong>{{ program.programName }}</strong></td>
                  <td>{{ program.phase }}</td>
                  <td class="comments-cell">{{ program.comments }}</td>
                  <td>
                    <span class="status-badge" [ngClass]="getStatusClass(program.status)">
                      {{ program.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recognition & Awards -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">Recognition & Awards</h2>
            <a routerLink="/recognition" class="view-link">View All →</a>
          </div>
          
          <div class="recognition-content">
            <div class="recognition-card">
              <div class="avatar">IA</div>
              <div class="recognition-info">
                <h3>Istabraq Al Ruhaili</h3>
                <p class="team-badge">🏆 Team</p>
                <p class="category">AI Guidance - OQ Engagements</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Building Activities -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">Team Building Activities</h2>
            <button *ngIf="authService.isLeader()" (click)="openAddActivityModal()" class="add-btn">
              Add Activity
            </button>
          </div>
          
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Date</th>
                  <th>Activity Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let activity of teamActivities" (click)="openActivityModal(activity)">
                  <td>{{ activity.team?.teamName }}</td>
                  <td>{{ activity.activityDate | date:'MMM d, yyyy' }}</td>
                  <td>{{ activity.activityName }}</td>
                  <td>
                    <span class="status-badge" [ngClass]="getStatusClass(activity.status)">
                      {{ activity.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- IDE Highlights -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">IDE Highlights</h2>
            <a routerLink="/highlights" class="view-link">View All →</a>
          </div>
          
          <div class="highlights-grid">
            <div *ngFor="let highlight of ideHighlights" 
                 class="highlight-card"
                 (click)="openHighlightModal(highlight)">
              <div class="highlight-indicator"></div>
              <div class="highlight-content">
                <h3>{{ highlight.highlightTitle }}</h3>
                <p>{{ highlight.description }}</p>
              </div>
              <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
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

  digitalPrograms: Program[] = [];
  teamActivities: TeamActivity[] = [];
  ideHighlights: IdeHighlight[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    Promise.all([
      this.loadDigitalPrograms(),
      this.loadTeamActivities(),
      this.loadIdeHighlights(),
      this.loadStats()
    ]).then(() => {
      this.loading = false;
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.loading = false;
    });
  }

  private async loadDigitalPrograms(): Promise<void> {
    this.dashboardService.getDigitalPrograms().subscribe({
      next: (programs) => {
        this.digitalPrograms = programs;
      },
      error: (error) => {
        console.error('Error loading digital programs:', error);
      }
    });
  }

  private async loadTeamActivities(): Promise<void> {
    this.dashboardService.getTeamActivities().subscribe({
      next: (activities) => {
        this.teamActivities = activities;
      },
      error: (error) => {
        console.error('Error loading team activities:', error);
      }
    });
  }

  private async loadIdeHighlights(): Promise<void> {
    this.dashboardService.getIdeHighlights().subscribe({
      next: (highlights) => {
        this.ideHighlights = highlights;
      },
      error: (error) => {
        console.error('Error loading IDE highlights:', error);
      }
    });
  }

  private async loadStats(): Promise<void> {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }

  openMetricDetails(type: string): void {
    this.notificationService.showInfo('Metric Details', `Opening details for ${type} metrics`);
  }

  viewProgram(program: Program): void {
    this.notificationService.showInfo('Program Details', `Viewing details for ${program.programName}`);
  }

  openActivityModal(activity: TeamActivity): void {
    this.notificationService.showInfo('Activity Details', `Viewing details for ${activity.activityName}`);
  }

  openAddActivityModal(): void {
    this.notificationService.showInfo('Add Activity', 'Opening add activity form');
  }

  openHighlightModal(highlight: IdeHighlight): void {
    this.notificationService.showInfo('Highlight Details', `Viewing ${highlight.highlightTitle}`);
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

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'On Track': 'status-on-track',
      'Delayed by 20%': 'status-delayed',
      'At Risk': 'status-at-risk',
      'Planning': 'status-planning',
      'In Progress': 'status-in-progress',
      'Done': 'status-done'
    };
    return statusMap[status] || '';
  }
}