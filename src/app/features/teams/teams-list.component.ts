import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../shared/components/layout/modal.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner.component';
import { TeamService, TeamStatistics } from '../../data-access/repositories/team.repository';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Team } from '../../data-access/models/team.model';
import { UserData } from '../../data-access/models/user-data.model';
import { Directorate } from '../../data-access/models/directorate.model';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTableComponent,
    ModalComponent,
    CardComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Teams Management</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage DCoE teams and team members</p>
        </div>
        
        <button 
          *ngIf="authService.isLeader()"
          (click)="openCreateTeamModal()"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          New Team
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6" *ngIf="!loading">
        <app-card
          title="Total Teams"
          [value]="statistics?.totalTeams?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
          iconColor="blue"
          [clickable]="false"
        />
        
        <app-card
          title="Total Members"
          [value]="statistics?.totalMembers?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>'
          iconColor="green"
          [clickable]="false"
        />
        
        <app-card
          title="Avg Team Size"
          [value]="statistics?.averageTeamSize?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
          iconColor="purple"
          [clickable]="false"
        />
        
        <app-card
          title="Active Teams"
          [value]="statistics?.activeTeams?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
          iconColor="red"
          [clickable]="false"
        />
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <app-loading-spinner />
      </div>

      <!-- Teams Table -->
      <div *ngIf="!loading">
        <app-data-table
          title="Teams"
          entityName="Team"
          [data]="teams"
          [columns]="tableColumns"
          [actions]="tableActions"
          [showAddButton]="false"
          (rowClick)="viewTeam($event)"
          (addClick)="openCreateTeamModal()"
        />
      </div>

      <!-- Team Detail Modal -->
      <app-modal
        [isOpen]="detailModalOpen"
        [title]="selectedTeam?.teamName || 'Team Details'"
        [showFooter]="false"
        (close)="detailModalOpen = false"
      >
        <div *ngIf="selectedTeam" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Name</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedTeam.teamName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Directorate</label>
              <p class="text-gray-900 dark:text-white">{{ selectedTeam.directorate?.name || 'Not assigned' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Members</label>
              <p class="text-gray-900 dark:text-white">{{ selectedTeam.members?.length || 0 }} members</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created Date</label>
              <p class="text-gray-900 dark:text-white">{{ selectedTeam.createdAt | date:'fullDate' }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <p class="text-gray-900 dark:text-white">{{ selectedTeam.description }}</p>
          </div>

          <!-- Team Members Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">Team Members</h4>
              <button 
                *ngIf="authService.isLeader()"
                (click)="openMemberManagementModal(selectedTeam)"
                class="btn-secondary text-sm"
              >
                Manage Members
              </button>
            </div>
            
            <div *ngIf="selectedTeam.members && selectedTeam.members.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div *ngFor="let member of selectedTeam.members" 
                   class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-blue-600 dark:text-blue-300">
                      {{ member.firstName.charAt(0) }}{{ member.lastName.charAt(0) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ member.displayName }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ member.jobDescription }}</p>
                </div>
              </div>
            </div>

            <div *ngIf="!selectedTeam.members || selectedTeam.members.length === 0" 
                 class="text-center py-8 text-gray-500 dark:text-gray-400">
              No team members assigned yet.
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              *ngIf="authService.isLeader()"
              (click)="editTeam(selectedTeam)"
              class="btn-primary"
            >
              Edit Team
            </button>
          </div>
        </div>
      </app-modal>

      <!-- Create/Edit Team Modal -->
      <app-modal
        [isOpen]="formModalOpen"
        [title]="isEditMode ? 'Edit Team' : 'Create New Team'"
        saveButtonText="Save Team"
        [showFooter]="true"
        (save)="saveTeam()"
        (cancel)="closeFormModal()"
        (close)="closeFormModal()"
      >
        <form [formGroup]="teamForm" class="space-y-4">
          <div>
            <label for="teamName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Name *
            </label>
            <input 
              type="text" 
              id="teamName"
              formControlName="teamName"
              class="input-field"
              placeholder="Enter team name (e.g., IDE 9)"
            />
            <div *ngIf="teamForm.get('teamName')?.invalid && teamForm.get('teamName')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
              Team name is required
            </div>
          </div>

          <div>
            <label for="directorate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Directorate *
            </label>
            <select 
              id="directorate"
              formControlName="directorateId"
              class="input-field"
            >
              <option value="">Select a directorate</option>
              <option *ngFor="let directorate of directorates" [value]="directorate.directorateId">
                {{ directorate.name }} ({{ directorate.code }})
              </option>
            </select>
            <div *ngIf="teamForm.get('directorateId')?.invalid && teamForm.get('directorateId')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
              Please select a directorate
            </div>
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
              placeholder="Enter team description, objectives, and focus areas"
            ></textarea>
            <div *ngIf="teamForm.get('description')?.invalid && teamForm.get('description')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
              Description is required
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Describe the team's purpose, key responsibilities, and areas of expertise.
            </p>
          </div>
        </form>
      </app-modal>

      <!-- Member Management Modal -->
      <app-modal
        [isOpen]="memberModalOpen"
        [title]="'Manage Members - ' + (selectedTeam?.teamName || '')"
        [showFooter]="false"
        (close)="memberModalOpen = false"
      >
        <div *ngIf="selectedTeam" class="space-y-4">
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Current members: {{ selectedTeam.members?.length || 0 }}
          </div>
          
          <!-- Current Members List -->
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div *ngFor="let member of selectedTeam.members" 
                 class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-600 dark:text-blue-300">
                    {{ member.firstName.charAt(0) }}{{ member.lastName.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ member.displayName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ member.jobDescription }}</p>
                </div>
              </div>
              <button 
                *ngIf="authService.isLeader()"
                (click)="removeMemberFromTeam(member)"
                class="text-red-600 hover:text-red-800 text-sm"
                title="Remove from team"
              >
                Remove
              </button>
            </div>
          </div>

          <div *ngIf="!selectedTeam.members || selectedTeam.members.length === 0" 
               class="text-center py-8 text-gray-500 dark:text-gray-400">
            No members in this team yet.
          </div>

          <div class="border-t pt-4 mt-4">
            <button class="btn-primary w-full" (click)="notificationService.showInfo('Add Member', 'Add member functionality will be implemented with user assignment features')">
              Add Member
            </button>
          </div>
        </div>
      </app-modal>

      <!-- Delete Confirmation Modal -->
      <app-modal
        [isOpen]="deleteModalOpen"
        title="Delete Team"
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
            This action cannot be undone. This will permanently delete the team
            <strong>"{{ teamToDelete?.teamName }}"</strong> and remove all member assignments.
          </p>
          <div *ngIf="teamToDelete && teamToDelete.members && teamToDelete.members.length > 0" class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <p class="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Warning:</strong> This team has {{ teamToDelete.members.length }} member(s) assigned.
            </p>
          </div>
        </div>
      </app-modal>
    </div>
  `
})
export class TeamListComponent implements OnInit {
  private teamService = inject(TeamService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  public notificationService = inject(NotificationService);

  teams: Team[] = [];
  statistics: TeamStatistics | null = null;
  loading = true;
  
  // Modal states
  detailModalOpen = false;
  formModalOpen = false;
  memberModalOpen = false;
  deleteModalOpen = false;
  isEditMode = false;
  selectedTeam: Team | null = null;
  teamToDelete: Team | null = null;

  // Form data
  teamForm: FormGroup = this.createTeamForm();
  directorates: Directorate[] = [];

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'teamName', label: 'Team Name', sortable: true },
    { key: 'directorate.name', label: 'Directorate', sortable: true },
    { 
      key: 'members.length', 
      label: 'Members', 
      type: 'number', 
      sortable: true, 
      width: '100px'
    },
    { 
      key: 'description', 
      label: 'Description', 
      sortable: false
    },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true }
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      action: (item) => this.viewTeam(item)
    },
    {
      label: 'Edit',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      class: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
      action: (item) => this.editTeam(item),
      visible: () => this.authService.isLeader()
    },
    {
      label: 'Members',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>',
      class: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
      action: (item) => this.openMemberManagementModal(item),
      visible: () => this.authService.isLeader()
    },
    {
      label: 'Delete',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      class: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
      action: (item) => this.deleteTeam(item),
      visible: () => this.authService.isLeader()
    }
  ];

  ngOnInit(): void {
    this.loadTeams();
    this.loadStatistics();
    this.loadDirectorates();
  }

  private createTeamForm(): FormGroup {
    return this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(2)]],
      directorateId: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private loadTeams(): void {
    this.loading = true;
    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
        this.loading = false;
      }
    });
  }

  private loadStatistics(): void {
    this.teamService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  private loadDirectorates(): void {
    this.teamService.getDirectorates().subscribe({
      next: (directorates) => {
        this.directorates = directorates;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  viewTeam(team: Team): void {
    this.selectedTeam = team;
    this.detailModalOpen = true;
  }

  openCreateTeamModal(): void {
    this.isEditMode = false;
    this.teamForm.reset();
    this.formModalOpen = true;
  }

  editTeam(team: Team): void {
    this.isEditMode = true;
    this.selectedTeam = team;
    this.teamForm.patchValue({
      teamName: team.teamName,
      directorateId: team.directorateId,
      description: team.description
    });
    this.formModalOpen = true;
  }

  deleteTeam(team: Team): void {
    this.teamToDelete = team;
    this.deleteModalOpen = true;
  }

  openMemberManagementModal(team: Team): void {
    this.selectedTeam = team;
    this.memberModalOpen = true;
  }

  saveTeam(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    const formValue = this.teamForm.value;
    
    if (this.isEditMode && this.selectedTeam) {
      this.teamService.update(this.selectedTeam.teamId, formValue).subscribe({
        next: () => {
          this.notificationService.showSaveSuccess('Team');
          this.loadTeams();
          this.loadStatistics();
          this.closeFormModal();
        },
        error: (error) => {
          this.notificationService.showApiError(error);
        }
      });
    } else {
      this.teamService.create(formValue).subscribe({
        next: () => {
          this.notificationService.showSaveSuccess('Team');
          this.loadTeams();
          this.loadStatistics();
          this.closeFormModal();
        },
        error: (error) => {
          this.notificationService.showApiError(error);
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.teamToDelete) {
      this.teamService.delete(this.teamToDelete.teamId).subscribe({
        next: () => {
          this.notificationService.showDeleteSuccess('Team');
          this.loadTeams();
          this.loadStatistics();
          this.deleteModalOpen = false;
          this.teamToDelete = null;
        },
        error: (error) => {
          this.notificationService.showApiError(error);
        }
      });
    }
  }

  removeMemberFromTeam(member: UserData): void {
    const selectedTeam = this.selectedTeam;
    if (!selectedTeam) {
      return;
    }
    
    this.teamService.removeMember(selectedTeam.teamId, member.personnelNumber).subscribe({
      next: () => {
        this.notificationService.showSuccess('Success', 'Member removed from team successfully');
        this.loadTeams();
        // Update selected team members - use local reference
        if (selectedTeam.members) {
          selectedTeam.members = selectedTeam.members.filter(m => m.personnelNumber !== member.personnelNumber);
          // Also update the class property if it's still the same team
          if (this.selectedTeam === selectedTeam) {
            this.selectedTeam = selectedTeam;
          }
        }
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  closeFormModal(): void {
    this.formModalOpen = false;
    this.teamForm.reset();
    this.selectedTeam = null;
    this.isEditMode = false;
  }
}