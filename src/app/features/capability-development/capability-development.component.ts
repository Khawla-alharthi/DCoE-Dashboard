import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner.component';
import { CapabilityDevelopmentService } from '../../data-access/repositories/capability-development.repository';
import { RoleService } from '../../core/services/role.service';
import { NotificationService } from '../../core/services/notification.service';

interface CapabilityCard {
  title: string;
  count: number;
  icon: string;
  iconColor: string;
  description: string[];
  status?: string;
}

@Component({
  selector: 'app-capability-development',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="space-y-6">
      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <app-loading-spinner />
      </div>

      <div *ngIf="!loading">
        <!-- Page Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Capability Development</h1>
            <p class="text-gray-600 dark:text-gray-400">Digital Centre of Excellence - Capability Building Programs</p>
          </div>
          
          <button 
            *ngIf="roleService.hasPermission('canCreate')"
            (click)="addNewProgram()"
            class="btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Add Program
          </button>
        </div>

        <!-- Capability Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            *ngFor="let card of capabilityCards" 
            class="card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
            (click)="openCardDetails(card)"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div 
                  class="p-3 rounded-full"
                  [ngClass]="getIconBackgroundClass(card.iconColor)"
                >
                  <div 
                    [innerHTML]="card.icon"
                    class="w-6 h-6"
                    [ngClass]="getIconTextClass(card.iconColor)"
                  ></div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ card.title }}</h3>
                  <div class="text-3xl font-bold mt-1" [ngClass]="getCountTextClass(card.iconColor)">
                    {{ card.count }}
                  </div>
                </div>
              </div>
              
              <!-- Status Badge -->
              <span 
                *ngIf="card.status"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                [ngClass]="getStatusBadgeClass(card.status)"
              >
                {{ card.status }}
              </span>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <div 
                *ngFor="let item of card.description" 
                class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{{ item }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end mt-4 space-x-2">
              <button 
                *ngIf="roleService.hasPermission('canUpdate')"
                (click)="editProgram(card); $event.stopPropagation()"
                class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                title="Edit Program"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              
              <button 
                *ngIf="roleService.hasPermission('canDelete')"
                (click)="deleteProgram(card); $event.stopPropagation()"
                class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                title="Delete Program"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Statistics Summary -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ statistics?.totalPrograms || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Programs</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ statistics?.byStatus?.completed || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ statistics?.byStatus?.inProgress || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ statistics?.byStatus?.planned || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Planned</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CapabilityDevelopmentComponent implements OnInit {
  private capabilityService = inject(CapabilityDevelopmentService);
  public roleService = inject(RoleService);
  private notificationService = inject(NotificationService);

  loading = true;
  statistics: any = {};
  
  capabilityCards: CapabilityCard[] = [
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
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>',
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

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.capabilityService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'Failed to load capability development data');
        this.loading = false;
      }
    });
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

  getStatusBadgeClass(status: string): string {
    const classes = {
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Planned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'On Hold': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[status as keyof typeof classes] || classes['In Progress'];
  }

  openCardDetails(card: CapabilityCard): void {
    this.notificationService.showInfo(card.title, `Viewing details for ${card.title} program`);
  }

  addNewProgram(): void {
    this.notificationService.showInfo('Add Program', 'Add new capability development program functionality will be available soon');
  }

  editProgram(card: CapabilityCard): void {
    this.notificationService.showInfo('Edit Program', `Edit functionality for ${card.title} will be available soon`);
  }

  deleteProgram(card: CapabilityCard): void {
    this.notificationService.showInfo('Delete Program', `Delete functionality for ${card.title} will be available soon`);
  }
}