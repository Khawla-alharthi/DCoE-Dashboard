import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner.component';
import { ThemeToggleComponent } from '../../shared/components/ui/theme-toggle.component';
import { DashboardService, DashboardStats } from '../../data-access/services/api/dashboard-api.service';
import { CapabilityDevelopmentService } from '../../data-access/repositories/capability-development.repository';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Program } from '../../data-access/models/program.model';
import { IdeHighlight } from '../../data-access/models/ide-highlight.model';
import { TeamActivity } from '../../data-access/models/team-activity.model';

interface CapabilityCard {
  title: string;
  count: number;
  icon: string;
  iconColor: string;
  description: string[];
  status?: string;
}

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
  private capabilityService = inject(CapabilityDevelopmentService);
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
  capabilityCards: CapabilityCard[] = [];

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
    this.loadCapabilityData();
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

  private loadCapabilityData(): void {
    this.capabilityCards = [
      {
        title: 'Staff Digital Muscle',
        count: 26,
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
        iconColor: 'blue',
        description: [
          '8 PDO Staff graduated with Digital Muscle Program',
          '3 Trainee Program',
          '15 Data Science'
        ],
        status: 'In Progress'
      },
      {
        title: 'On-the-Job Training - Lead',
        count: 5,
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
        iconColor: 'purple',
        description: [
          'Software Engineer Business Knowledge',
          '3 Trainee Program',
          '2 Data Science Governance'
        ],
        status: 'In Progress'
      },
      {
        title: 'CI Ideas',
        count: 1,
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
        iconColor: 'yellow',
        description: [
          'Ideas collected and reviewed',
          '1 Idea implemented'
        ],
        status: 'Completed'
      },
      {
        title: 'Training Completed',
        count: 3,
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        iconColor: 'green',
        description: [
          'MIT Applied Data Science',
          'PDO Data Science',
          'Digital Project Management'
        ],
        status: 'Completed'
      },
      {
        title: 'Training In Progress',
        count: 1,
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        iconColor: 'blue',
        description: [
          'Data scientists learning from Capability',
          'Development Team'
        ],
        status: 'In Progress'
      },
      {
        title: 'Certifications',
        count: 4,
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
        iconColor: 'purple',
        description: [
          'Planning on General Fundamentals (PG-F)',
          'Professional Azure Master (PAM-F)',
          'Certified Business Analyst (CBA)',
          'Certified Scrum Master (CSM)'
        ],
        status: 'In Progress'
      }
    ];
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

  getIconBackgroundClass(color: string): string {
    const classes = {
      'blue': 'bg-blue-100 dark:bg-blue-900',
      'purple': 'bg-purple-100 dark:bg-purple-900',
      'yellow': 'bg-yellow-100 dark:bg-yellow-900',
      'green': 'bg-green-100 dark:bg-green-900',
      'red': 'bg-red-100 dark:bg-red-900'
    };
    return classes[color as keyof typeof classes] || classes['blue'];
  }

  getIconTextClass(color: string): string {
    const classes = {
      'blue': 'text-blue-600 dark:text-blue-400',
      'purple': 'text-purple-600 dark:text-purple-400',
      'yellow': 'text-yellow-600 dark:text-yellow-400',
      'green': 'text-green-600 dark:text-green-400',
      'red': 'text-red-600 dark:text-red-400'
    };
    return classes[color as keyof typeof classes] || classes['blue'];
  }

  getCountTextClass(color: string): string {
    const classes = {
      'blue': 'text-blue-600 dark:text-blue-400',
      'purple': 'text-purple-600 dark:text-purple-400',
      'yellow': 'text-yellow-600 dark:text-yellow-400',
      'green': 'text-green-600 dark:text-green-400',
      'red': 'text-red-600 dark:text-red-400'
    };
    return classes[color as keyof typeof classes] || classes['blue'];
  }

  getCapabilityStatusBadgeClass(status: string): string {
    const classes = {
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Planned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'On Hold': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[status as keyof typeof classes] || classes['In Progress'];
  }

  openCapabilityDetails(card: CapabilityCard): void {
    this.notificationService.showInfo(card.title, `Viewing details for ${card.title} program`);
  }
}