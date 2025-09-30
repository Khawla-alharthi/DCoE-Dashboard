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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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

  // Dollar Savings Doughnut Chart
  dollarSavingsChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['CP', 'EVD', 'Finance', 'HSE', 'IDC', 'IDD', 'ISGL', 'OSD', 'Petroleum', 'UWD'],
    datasets: [{
      data: [12, 25, 15, 8, 5, 18, 3, 7, 4, 3],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(20, 184, 166, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(34, 211, 238, 0.8)',
        'rgba(248, 113, 113, 0.8)'
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  dollarSavingsChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#6b7280',
          padding: 15,
          font: {
            size: 11
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: $${value}M`;
          }
        }
      }
    }
  };

  // Project Status Bar Chart
  projectStatusChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['CP', 'EVD', 'Finance', 'HSE', 'IDC', 'IDD', 'ISGL', 'OSD', 'Petroleum', 'UWD'],
    datasets: [
      {
        label: 'Development',
        data: [3, 5, 4, 3, 2, 1, 2, 3, 1, 2],
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderRadius: 4,
        maxBarThickness: 40
      },
      {
        label: 'Planning',
        data: [2, 3, 2, 1, 1, 2, 1, 2, 1, 1],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
        maxBarThickness: 40
      },
      {
        label: 'Production',
        data: [5, 12, 11, 3, 3, 21, 3, 7, 2, 9],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 4,
        maxBarThickness: 40
      },
      {
        label: 'Under Discussion',
        data: [1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderRadius: 4,
        maxBarThickness: 40
      }
    ]
  };

  projectStatusChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6b7280',
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
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
        this.notificationService.showError('Error', 'Failed to load dashboard statistics');
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