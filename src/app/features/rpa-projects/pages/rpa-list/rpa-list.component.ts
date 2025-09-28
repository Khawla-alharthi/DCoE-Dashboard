import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../../shared/components/layout/modal.component';
import { RpaProjectService } from '../../../../data-access/repositories/rpa-project.repository';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { RpaProject } from '../../../../data-access/models/rpa-project.model';

@Component({
  selector: 'app-rpa-list',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    ModalComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">RPA Projects</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage Robotic Process Automation projects</p>
        </div>
        
        <button 
          *ngIf="authService.isLeader()"
          (click)="navigateToCreate()"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          New RPA Project
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card p-4">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics?.totalProjects || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">\${{ formatCurrency(statistics?.totalValue || 0) }}</p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Manhour Savings</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(statistics?.totalManhourSavings || 0) }}</p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 002 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Robots</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics?.totalRobots || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects Table -->
      <app-data-table
        title="RPA Projects"
        entityName="Project"
        [data]="projects"
        [columns]="tableColumns"
        [actions]="tableActions"
        [showAddButton]="false"
        (rowClick)="viewProject($event)"
        (addClick)="navigateToCreate()"
      />

      <!-- Project Detail Modal -->
      <app-modal
        [isOpen]="detailModalOpen"
        [title]="selectedProject?.projectName || 'Project Details'"
        [showFooter]="false"
        (close)="detailModalOpen = false"
      >
        <div *ngIf="selectedProject" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedProject.projectName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Type</label>
              <p class="text-gray-900 dark:text-white">{{ selectedProject.projectType }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                    [ngClass]="getStatusBadgeClass(selectedProject.status)">
                {{ selectedProject.status }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Robots Count</label>
              <p class="text-gray-900 dark:text-white">{{ selectedProject.robotsCount }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manhour Savings</label>
              <p class="text-gray-900 dark:text-white">{{ formatNumber(selectedProject.manhourSavings) }} hours</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value Generated</label>
              <p class="text-green-600 dark:text-green-400 font-semibold">\${{ formatCurrency(selectedProject.valueGenerated) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created Date</label>
              <p class="text-gray-900 dark:text-white">{{ selectedProject.createdAt | date:'fullDate' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Updated</label>
              <p class="text-gray-900 dark:text-white">{{ selectedProject.updatedAt | date:'short' }}</p>
            </div>
          </div>
          
          <!-- ROI Calculation -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Return on Investment</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">\${{ formatCurrency(selectedProject.valueGenerated) }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Value Generated</p>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-2xl font-bold text-green-600">{{ formatNumber(selectedProject.manhourSavings) }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Hours Saved</p>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-2xl font-bold text-purple-600">{{ calculateROI(selectedProject) }}%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">ROI</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              *ngIf="authService.isLeader()"
              (click)="editProject(selectedProject)"
              class="btn-primary"
            >
              Edit Project
            </button>
          </div>
        </div>
      </app-modal>

      <!-- Delete Confirmation Modal -->
      <app-modal
        [isOpen]="deleteModalOpen"
        title="Delete Project"
        saveButtonText="Delete"
        (save)="confirmDelete()"
        (close)="deleteModalOpen = false"
      >
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Are you sure?</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone. This will permanently delete the project
            <strong>"{{ projectToDelete?.projectName }}"</strong>.
          </p>
        </div>
      </app-modal>
    </div>
  `
})
export class RpaListComponent implements OnInit {
  private rpaProjectService = inject(RpaProjectService);
  private router = inject(Router);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  projects: RpaProject[] = [];
  statistics: any = {};
  loading = true;
  
  // Modal states
  detailModalOpen = false;
  deleteModalOpen = false;
  selectedProject: RpaProject | null = null;
  projectToDelete: RpaProject | null = null;

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'projectName', label: 'Project Name', sortable: true },
    { key: 'projectType', label: 'Type', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      badgeConfig: {
        'Production': { class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Production' },
        'Development': { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Development' },
        'Planning': { class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', label: 'Planning' },
        'Under Discussion': { class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', label: 'Under Discussion' }
      }
    },
    { key: 'robotsCount', label: 'Robots', type: 'number', sortable: true, width: '100px' },
    { key: 'manhourSavings', label: 'Hours Saved', type: 'number', sortable: true },
    { key: 'valueGenerated', label: 'Value ($)', type: 'number', sortable: true },
    { key: 'updatedAt', label: 'Last Updated', type: 'date', sortable: true }
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      action: (item) => this.viewProject(item)
    },
    {
      label: 'Edit',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      class: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
      action: (item) => this.editProject(item),
      visible: () => this.authService.isLeader()
    },
    {
      label: 'Delete',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      class: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
      action: (item) => this.deleteProject(item),
      visible: () => this.authService.isLeader()
    }
  ];

  ngOnInit(): void {
    this.loadProjects();
    this.loadStatistics();
  }

  private loadProjects(): void {
    this.loading = true;
    this.rpaProjectService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'Failed to load RPA projects');
        this.loading = false;
      }
    });
  }

  private loadStatistics(): void {
    this.rpaProjectService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'Failed to load statistics');
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/rpa-projects/create']);
  }

  viewProject(project: RpaProject): void {
    this.selectedProject = project;
    this.detailModalOpen = true;
  }

  editProject(project: RpaProject): void {
    this.router.navigate(['/rpa-projects/edit', project.projectId]);
  }

  deleteProject(project: RpaProject): void {
    this.projectToDelete = project;
    this.deleteModalOpen = true;
  }

  confirmDelete(): void {
    if (this.projectToDelete) {
      this.rpaProjectService.delete(this.projectToDelete.projectId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'Project deleted successfully');
          this.loadProjects();
          this.loadStatistics();
          this.deleteModalOpen = false;
          this.projectToDelete = null;
        },
        error: (error) => {
          this.notificationService.showError('Error', 'Failed to delete project');
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses = {
      'Production': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Development': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Under Discussion': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  formatCurrency(value: number): string {
    return (value / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 }) + 'K';
  }

  formatNumber(value: number): string {
    return value.toLocaleString('en-US');
  }

  calculateROI(project: RpaProject): number {
    // Simple ROI calculation: (Value Generated / Estimated Investment) * 100
    // Assuming average investment of $50K per robot
    const estimatedInvestment = project.robotsCount * 50000;
    return estimatedInvestment > 0 ? Math.round((project.valueGenerated / estimatedInvestment) * 100) : 0;
  }
}