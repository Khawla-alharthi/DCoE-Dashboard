import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { RpaProjectService } from '../../data-access/repositories/rpa-project.repository';
import { ProgramRepository } from '../../data-access/repositories/program.repository';
import { HighlightsService } from '../../data-access/repositories/ide-highlights.repository';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { IdeHighlight } from '../../data-access/models/ide-highlight.model';

interface DashboardStats {
  totalProjects: number;
  valueGenerated: number;
  actualPercentage: number;
  externalEngagements: number;
  liveProcesses: number;
  inDevelopment: number;
  planned: number;
  manhourSavings: number;
  robots: number;
}

interface DashboardHighlight {
  title: string;
  description: string;
  type: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ModalComponent,
    DataTableComponent,
    LoadingSpinnerComponent,
    ThemeToggleComponent,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private rpaProjectService = inject(RpaProjectService);
  private programService = inject(ProgramRepository);
  private highlightsService = inject(HighlightsService);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  // Loading states
  loading = true;
  statsLoading = false;

  // Stats data
  stats: DashboardStats = {
    totalProjects: 37,
    valueGenerated: 7970000,
    actualPercentage: 81,
    externalEngagements: 9,
    liveProcesses: 109,
    inDevelopment: 14,
    planned: 8,
    manhourSavings: 23300,
    robots: 4
  };

  // Modal states
  statsModalOpen = false;
  activityModalOpen = false;
  highlightModalOpen = false;
  selectedStatsType = '';
  statsModalTitle = '';
  selectedActivity: any = null;
  selectedHighlight: DashboardHighlight | null = null;

  // IDE Highlights - loaded from service
  ideHighlights: DashboardHighlight[] = [];

  // Recent activities
  recentActivities = [
    {
      activityId: 1,
      activityName: 'Team Breakfast',
      activityDate: new Date('2025-07-24'),
      status: 'In Progress',
      team: { teamName: 'IDE 8' },
      description: 'Monthly team building breakfast session'
    },
    {
      activityId: 2,
      activityName: 'Team Breakfast',
      activityDate: new Date('2025-07-24'),
      status: 'In Progress',
      team: { teamName: 'IDE 4' },
      description: 'Monthly team building breakfast session'
    },
    {
      activityId: 3,
      activityName: 'Team Breakfast',
      activityDate: new Date('2025-07-15'),
      status: 'Done',
      team: { teamName: 'IDE 3' },
      description: 'Monthly team building breakfast session'
    }
  ];

  // Table configurations
  activityTableColumns: TableColumn[] = [
    { key: 'team.teamName', label: 'Team Name', sortable: true },
    { key: 'activityDate', label: 'Date', type: 'date', sortable: true },
    { key: 'activityName', label: 'Activity Name', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      badgeConfig: {
        'Planning': { class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', label: 'Planning' },
        'In Progress': { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'In Progress' },
        'Done': { class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Done' }
      }
    }
  ];

  activityTableActions: TableAction[] = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      action: (item) => this.openActivityModal(item)
    }
  ];

  // Chart configurations
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartData: ChartConfiguration['data'] = {
    labels: ['CP', 'EVD', 'Engineering', 'Exploration', 'Finance', 'GAS', 'HSE', 'IDD', 'Infrastructure', 'OSD', 'Operations', 'People', 'Petroleum', 'UPD', 'UWD'],
    datasets: [{
      data: [1200000, 950000, 1800000, 850000, 750000, 600000, 400000, 300000, 200000, 150000, 100000, 75000, 50000, 25000, 15000],
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280',
        '#14B8A6', '#F472B6', '#A78BFA', '#34D399', '#FBBF24'
      ]
    }]
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  barChartType: ChartType = 'bar';
  barChartData: ChartConfiguration['data'] = {
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

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    // Load highlights from service
    this.loadHighlights();
    
    // In a real application, you would load data from services
    // this.rpaProjectService.getAll().subscribe(...)
    // this.programService.getAll().subscribe(...)
    
    // For now, we use the mock data already set up
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  private loadHighlights(): void {
    this.highlightsService.getRecentHighlights(4).subscribe({
      next: (highlights) => {
        this.ideHighlights = highlights.map(h => ({
          title: h.highlightTitle,
          description: h.description,
          type: h.highlightType,
          date: h.highlightDate
        }));
      },
      error: (error) => {
        // Fallback to static data if service fails
        this.ideHighlights = [
          {
            title: 'Knowledge-sharing session with OQ Sohar',
            description: 'Collaborative session focused on best practices and digital transformation strategies',
            type: 'Knowledge Sharing',
            date: new Date('2025-08-15')
          },
          {
            title: 'Adam Scale-up',
            description: 'Scaling up the Adam automation platform to handle increased workload',
            type: 'System Enhancement', 
            date: new Date('2025-08-20')
          },
          {
            title: 'The World CIO 200 Summit',
            description: 'Participation in global CIO summit for digital innovation discussions',
            type: 'External Event',
            date: new Date('2025-08-25')
          },
          {
            title: 'RPA contributions',
            description: 'Significant contributions to Robotic Process Automation initiatives',
            type: 'Process Improvement',
            date: new Date('2025-08-30')
          }
        ];
      }
    });
  }

  openStatsModal(type: string): void {
    this.selectedStatsType = type;
    this.statsModalOpen = true;
    
    const titles = {
      'products': 'Total Products Breakdown',
      'value': 'Value Generated Details',
      'percentage': 'Achievement Percentage',
      'engagements': 'External Engagements'
    };
    
    this.statsModalTitle = titles[type as keyof typeof titles] || 'Stats Details';
  }

  openActivityModal(activity: any): void {
    this.selectedActivity = activity;
    this.activityModalOpen = true;
  }

  openAddActivityModal(): void {
    this.notificationService.showInfo('Add Activity', 'Team activity management feature will be available soon');
  }

  openHighlightModal(highlight: DashboardHighlight): void {
    this.selectedHighlight = highlight;
    this.highlightModalOpen = true;
  }

  getActivityStatusClass(status: string): string {
    const statusClasses = {
      'Planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  // Utility methods for better data presentation
  formatCurrency(value: number): string {
    return (value / 1000000).toFixed(1) + 'M';
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  refreshDashboard(): void {
    this.loadDashboardData();
    this.notificationService.showSuccess('Dashboard Refreshed', 'Data has been updated successfully');
  }
}