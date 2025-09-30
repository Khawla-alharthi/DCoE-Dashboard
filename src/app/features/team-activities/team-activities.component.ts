import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../shared/components/layout/modal.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TeamActivity } from '../../data-access/models/team-activity.model';
import { Team } from '../../data-access/models/team.model';

@Component({
  selector: 'app-team-activities',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTableComponent,
    ModalComponent,
    CardComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Team Building Activities</h1>
          <p class="text-gray-600 dark:text-gray-400">Plan and track team engagement events</p>
        </div>
        
        <button 
          *ngIf="authService.isLeader()"
          (click)="openCreateActivityModal()"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          New Activity
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <app-card
          title="Total Activities"
          value="12"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
          iconColor="blue"
          [clickable]="false"
        />
        
        <app-card
          title="In Progress"
          value="3"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
          iconColor="yellow"
          [clickable]="false"
        />
        
        <app-card
          title="Completed"
          value="8"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
          iconColor="green"
          trend="+25%"
          [clickable]="false"
        />
        
        <app-card
          title="Planning"
          value="1"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>'
          iconColor="purple"
          [clickable]="false"
        />
      </div>

      <!-- Activities Table -->
      <app-data-table
        title="Team Activities"
        entityName="Activity"
        [data]="activities"
        [columns]="tableColumns"
        [actions]="tableActions"
        [showAddButton]="false"
        (rowClick)="viewActivity($event)"
        (addClick)="openCreateActivityModal()"
      />

      <!-- Activity Detail Modal -->
      <app-modal
        [isOpen]="detailModalOpen"
        [title]="selectedActivity?.activityName || 'Activity Details'"
        [showFooter]="false"
        (close)="detailModalOpen = false"
      >
        <div *ngIf="selectedActivity" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activity Name</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedActivity.activityName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
              <p class="text-gray-900 dark:text-white">{{ selectedActivity.team?.teamName || 'All Teams' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <p class="text-gray-900 dark:text-white">{{ selectedActivity.activityDate | date:'fullDate' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                    [ngClass]="getStatusBadgeClass(selectedActivity.status)">
                {{ selectedActivity.status }}
              </span>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <p class="text-gray-900 dark:text-white">{{ selectedActivity.description }}</p>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button 
              *ngIf="authService.isLeader()"
              (click)="editActivity(selectedActivity)"
              class="btn-primary"
            >
              Edit Activity
            </button>
          </div>
        </div>
      </app-modal>

      <!-- Create/Edit Activity Modal -->
      <app-modal
        [isOpen]="formModalOpen"
        [title]="isEditMode ? 'Edit Activity' : 'Create New Activity'"
        saveButtonText="Save Activity"
        [showFooter]="true"
        (save)="saveActivity()"
        (cancel)="closeFormModal()"
        (close)="closeFormModal()"
      >
        <form [formGroup]="activityForm" class="space-y-4">
          <div>
            <label for="activityName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Activity Name *
            </label>
            <input 
              type="text" 
              id="activityName"
              formControlName="activityName"
              class="input-field"
              placeholder="Enter activity name"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="teamId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team *
              </label>
              <select 
                id="teamId"
                formControlName="teamId"
                class="input-field"
              >
                <option value="">Select a team</option>
                <option *ngFor="let team of teams" [value]="team.teamId">
                  {{ team.teamName }}
                </option>
              </select>
            </div>

            <div>
              <label for="activityDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Activity Date *
              </label>
              <input 
                type="date" 
                id="activityDate"
                formControlName="activityDate"
                class="input-field"
              />
            </div>
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <select 
              id="status"
              formControlName="status"
              class="input-field"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea 
              id="description"
              formControlName="description"
              rows="4"
              class="input-field"
              placeholder="Describe the activity, objectives, and expected outcomes"
            ></textarea>
          </div>
        </form>
      </app-modal>

      <!-- Delete Confirmation Modal -->
      <app-modal
        [isOpen]="deleteModalOpen"
        title="Delete Activity"
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
            This action cannot be undone. This will permanently delete the activity
            <strong>"{{ activityToDelete?.activityName }}"</strong>.
          </p>
        </div>
      </app-modal>
    </div>
  `
})
export class TeamActivitiesComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  activities: TeamActivity[] = [
    {
      activityId: 1,
      activityName: 'Team Breakfast',
      activityDate: new Date('2025-07-24'),
      status: 'In Progress',
      description: 'Monthly team building breakfast session to foster collaboration and team bonding',
      createdAt: new Date('2025-07-01'),
      updatedAt: new Date('2025-07-20'),
      createdBy: 'system',
      teamId: 8,
      team: { 
        teamId: 8,
        teamName: 'IDE 8',
        description: 'IDE Team 8',
        createdAt: new Date('2025-01-01'),
        directorateId: 1
      }
    },
    {
      activityId: 2,
      activityName: 'Team Breakfast',
      activityDate: new Date('2025-07-24'),
      status: 'In Progress',
      description: 'Monthly team building breakfast session',
      createdAt: new Date('2025-07-01'),
      updatedAt: new Date('2025-07-20'),
      createdBy: 'system',
      teamId: 4,
      team: { 
        teamId: 4,
        teamName: 'IDE 4',
        description: 'IDE Team 4',
        createdAt: new Date('2025-01-01'),
        directorateId: 1
      }
    },
    {
      activityId: 3,
      activityName: 'Team Breakfast',
      activityDate: new Date('2025-07-15'),
      status: 'Done',
      description: 'Monthly team building breakfast session',
      createdAt: new Date('2025-07-01'),
      updatedAt: new Date('2025-07-15'),
      createdBy: 'system',
      teamId: 3,
      team: { 
        teamId: 3,
        teamName: 'IDE 3',
        description: 'IDE Team 3',
        createdAt: new Date('2025-01-01'),
        directorateId: 1
      }
    }
  ];

  teams: Team[] = [
    { teamId: 1, teamName: 'IDE 1', description: 'Team 1', createdAt: new Date(), directorateId: 1 },
    { teamId: 2, teamName: 'IDE 2', description: 'Team 2', createdAt: new Date(), directorateId: 1 },
    { teamId: 3, teamName: 'IDE 3', description: 'Team 3', createdAt: new Date(), directorateId: 1 },
    { teamId: 4, teamName: 'IDE 4', description: 'Team 4', createdAt: new Date(), directorateId: 1 },
    { teamId: 5, teamName: 'IDE 5', description: 'Team 5', createdAt: new Date(), directorateId: 1 },
    { teamId: 6, teamName: 'IDE 6', description: 'Team 6', createdAt: new Date(), directorateId: 1 },
    { teamId: 7, teamName: 'IDE 7', description: 'Team 7', createdAt: new Date(), directorateId: 1 },
    { teamId: 8, teamName: 'IDE 8', description: 'Team 8', createdAt: new Date(), directorateId: 1 }
  ];

  detailModalOpen = false;
  formModalOpen = false;
  deleteModalOpen = false;
  isEditMode = false;
  selectedActivity: TeamActivity | null = null;
  activityToDelete: TeamActivity | null = null;

  activityForm: FormGroup = this.fb.group({
    activityName: ['', [Validators.required]],
    teamId: ['', [Validators.required]],
    activityDate: ['', [Validators.required]],
    status: ['Planning', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  tableColumns: TableColumn[] = [
    { key: 'team.teamName', label: 'Team', sortable: true },
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

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      action: (item) => this.viewActivity(item)
    },
    {
      label: 'Edit',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      class: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
      action: (item) => this.editActivity(item),
      visible: () => this.authService.isLeader()
    },
    {
      label: 'Delete',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      class: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
      action: (item) => this.deleteActivity(item),
      visible: () => this.authService.isLeader()
    }
  ];

  ngOnInit(): void {
    // Load activities if needed
  }

  viewActivity(activity: TeamActivity): void {
    this.selectedActivity = activity;
    this.detailModalOpen = true;
  }

  openCreateActivityModal(): void {
    this.isEditMode = false;
    this.activityForm.reset({ status: 'Planning' });
    this.formModalOpen = true;
  }

  editActivity(activity: TeamActivity): void {
    this.isEditMode = true;
    this.selectedActivity = activity;
    this.activityForm.patchValue({
      activityName: activity.activityName,
      teamId: activity.teamId,
      activityDate: activity.activityDate.toISOString().split('T')[0],
      status: activity.status,
      description: activity.description
    });
    this.formModalOpen = true;
  }

  deleteActivity(activity: TeamActivity): void {
    this.activityToDelete = activity;
    this.deleteModalOpen = true;
  }

  saveActivity(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const formValue = this.activityForm.value;
    
    if (this.isEditMode && this.selectedActivity) {
      this.notificationService.showSuccess('Success', 'Activity updated successfully');
      this.closeFormModal();
    } else {
      const newActivity: TeamActivity = {
        activityId: Date.now(),
        activityName: formValue.activityName,
        teamId: parseInt(formValue.teamId),
        activityDate: new Date(formValue.activityDate),
        status: formValue.status,
        description: formValue.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'Current User',
        team: this.teams.find(t => t.teamId === parseInt(formValue.teamId))
      };
      
      this.activities.unshift(newActivity);
      this.notificationService.showSuccess('Success', 'Activity created successfully');
      this.closeFormModal();
    }
  }

  confirmDelete(): void {
    if (this.activityToDelete) {
      this.activities = this.activities.filter(a => a.activityId !== this.activityToDelete!.activityId);
      this.notificationService.showSuccess('Success', 'Activity deleted successfully');
      this.deleteModalOpen = false;
      this.activityToDelete = null;
    }
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses = {
      'Planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  closeFormModal(): void {
    this.formModalOpen = false;
    this.activityForm.reset({ status: 'Planning' });
    this.selectedActivity = null;
    this.isEditMode = false;
  }
}