// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Enhanced components (placeholder imports - you'll need to implement these)
import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner.component';
import { ThemeToggleComponent } from '../../shared/components/ui/theme-toggle.component';

// Services
import { DashboardService, DashboardStats } from '../../data-access/services/api/dashboard-api.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

// Models
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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  // Component state
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

  // Data arrays
  digitalPrograms: Program[] = [];
  teamActivities: TeamActivity[] = [];
  ideHighlights: IdeHighlight[] = [];

  // Chart configurations
  doughnutChartData: any = {
    labels: ['CP', 'EVD', 'Engineering', 'Exploration', 'Finance', 'GAS', 'HSE', 'IDD', 
             'Infrastructure', 'OSD', 'Operations', 'People', 'Petroleum', 'UPD', 'UWD'],
    datasets: [{
      data: [1200000, 950000, 1800000, 850000, 750000, 600000, 400000, 300000, 
             200000, 150000, 100000, 75000, 50000, 25000, 15000],
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280',
        '#14B8A6', '#F472B6', '#A78BFA', '#34D399', '#FBBF24'
      ],
      borderWidth: 0
    }]
  };

  doughnutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed || 0;
            return `${context.label}: ${this.formatCurrencyShort(value)}`;
          }
        }
      }
    }
  };

  barChartData: any = {
    labels: ['CP', 'EVD', 'Finance', 'HSE', 'IDC', 'IDD', 'ISCL', 'OSD', 'Petroleum', 'UWD'],
    datasets: [
      {
        label: 'Development',
        data: [2, 4, 1, 1, 0, 0, 1, 1, 3, 1],
        backgroundColor: '#F59E0B'
      },
      {
        label: 'Planning',
        data: [1, 2, 1, 2, 0, 0, 2, 1, 1, 2],
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Production',
        data: [8, 14, 2, 0, 6, 25, 2, 6, 6, 3],
        backgroundColor: '#10B981'
      },
      {
        label: 'Under Discussion',
        data: [0, 0, 0, 0, 0, 0, 2, 0, 2, 0],
        backgroundColor: '#8B5CF6'
      }
    ]
  };

  barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    }
  };

  // Table configurations
  digitalProgramColumns = [
    { key: 'programName', label: 'Program Name', sortable: true },
    { key: 'phase', label: 'Phase', sortable: true },
    { key: 'comments', label: 'Comments', sortable: false },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      sortable: true,
      badgeConfig: {
        'On Track': { class: 'status-badge status-on-track', label: 'On Track' },
        'Delayed by 20%': { class: 'status-badge status-delayed', label: 'Delayed by 20%' },
        'At Risk': { class: 'status-badge status-at-risk', label: 'At Risk' }
      }
    }
  ];

  digitalProgramActions = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      handler: (item: Program) => this.viewProgram(item),
      class: 'action-btn action-view'
    }
  ];

  activityColumns = [
    { key: 'team.teamName', label: 'Team Name', sortable: true },
    { key: 'activityDate', label: 'Date', type: 'date', sortable: true },
    { key: 'activityName', label: 'Activity Name', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      sortable: true,
      badgeConfig: {
        'Planning': { class: 'status-badge status-planning', label: 'Planning' },
        'In Progress': { class: 'status-badge status-in-progress', label: 'In Progress' },
        'Done': { class: 'status-badge status-done', label: 'Done' }
      }
    }
  ];

  activityActions = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      handler: (item: TeamActivity) => this.openActivityModal(item),
      class: 'action-btn action-view'
    }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    // Load all dashboard data
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

  // Event handlers
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

  // Utility methods
  formatCurrency(value: number): string {
    return `${(value / 1000000).toFixed(2)}M`;
  }

  formatCurrencyShort(value: number): string {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  formatNumber(value: number): string {
    return `${(value / 1000).toFixed(1)}K`;
  }
}