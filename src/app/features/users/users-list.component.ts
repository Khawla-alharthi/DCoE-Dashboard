import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { UserService, UserStatistics } from '../../data-access/repositories/user.repository';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserData } from '../../data-access/models/user-data.model';
import { Role } from '../../data-access/models/role.model';
import { Team } from '../../data-access/models/team.model';

@Component({
  selector: 'app-user-list',
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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage DCoE users and their roles</p>
        </div>
        
        <button 
          *ngIf="authService.isLeader()"
          (click)="openCreateUserModal()"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          New User
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <app-card
          title="Total Users"
          [value]="statistics?.totalUsers?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>'
          iconColor="blue"
          [clickable]="false"
        />
        
        <app-card
          title="Active Users"
          [value]="statistics?.activeUsers?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
          iconColor="green"
          [clickable]="false"
        />
        
        <app-card
          title="New This Month"
          [value]="statistics?.newUsersThisMonth?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>'
          iconColor="purple"
          trend="+8%"
          [clickable]="false"
        />
        
        <app-card
          title="Teams Assigned"
          [value]="getTeamsAssignedCount()"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
          iconColor="red"
          [clickable]="false"
        />
      </div>

      <!-- Users Table -->
      <app-data-table
        title="Users Directory"
        entityName="User"
        [data]="users"
        [columns]="tableColumns"
        [actions]="tableActions"
        [showAddButton]="false"
        (rowClick)="viewUser($event)"
        (addClick)="openCreateUserModal()"
      />

      <!-- User Detail Modal -->
      <app-modal
        [isOpen]="detailModalOpen"
        [title]="selectedUser?.displayName || 'User Details'"
        [showFooter]="false"
        (close)="detailModalOpen = false"
      >
        <div *ngIf="selectedUser" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedUser.displayName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personnel Number</label>
              <p class="text-gray-900 dark:text-white">{{ selectedUser.personnelNumber }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <p class="text-gray-900 dark:text-white">{{ selectedUser.emailAddress }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <p class="text-gray-900 dark:text-white">{{ selectedUser.officePhone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
              <p class="text-gray-900 dark:text-white">{{ selectedUser.team?.teamName || 'Not assigned' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    [ngClass]="selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ selectedUser.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
              <p class="text-gray-900 dark:text-white">{{ selectedUser.jobDescription }}</p>
            </div>
          </div>

          <!-- User Roles Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">User Roles</h4>
              <button 
                *ngIf="authService.isLeader()"
                (click)="openRoleManagementModal(selectedUser)"
                class="btn-secondary text-sm"
              >
                Manage Roles
              </button>
            </div>
            
            <div *ngIf="selectedUser.roles && selectedUser.roles.length > 0" class="flex flex-wrap gap-2">
              <span *ngFor="let userRole of selectedUser.roles" 
                    class="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {{ userRole.role?.roleName }}
              </span>
            </div>

            <div *ngIf="!selectedUser.roles || selectedUser.roles.length === 0" 
                 class="text-gray-500 dark:text-gray-400 text-sm">
              No roles assigned yet.
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              *ngIf="authService.isLeader() && !selectedUser.isActive"
              (click)="activateUser(selectedUser)"
              class="btn-secondary"
            >
              Activate User
            </button>
            <button 
              *ngIf="authService.isLeader()"
              (click)="editUser(selectedUser)"
              class="btn-primary"
            >
              Edit User
            </button>
          </div>
        </div>
      </app-modal>

      <!-- Create/Edit User Modal -->
      <app-modal
        [isOpen]="formModalOpen"
        [title]="isEditMode ? 'Edit User' : 'Create New User'"
        saveButtonText="Save User"
        [showFooter]="true"
        (save)="saveUser()"
        (cancel)="closeFormModal()"
        (close)="closeFormModal()"
      >
        <form [formGroup]="userForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <input 
                type="text" 
                id="firstName"
                formControlName="firstName"
                class="input-field"
                placeholder="Enter first name"
              />
              <div *ngIf="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                First name is required
              </div>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <input 
                type="text" 
                id="lastName"
                formControlName="lastName"
                class="input-field"
                placeholder="Enter last name"
              />
              <div *ngIf="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                Last name is required
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="emailAddress" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input 
                type="email" 
                id="emailAddress"
                formControlName="emailAddress"
                class="input-field"
                placeholder="Enter email address"
              />
              <div *ngIf="userForm.get('emailAddress')?.invalid && userForm.get('emailAddress')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                Valid email address is required
              </div>
            </div>

            <div>
              <label for="officePhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Office Phone
              </label>
              <input 
                type="tel" 
                id="officePhone"
                formControlName="officePhone"
                class="input-field"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="companyNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Number *
              </label>
              <input 
                type="text" 
                id="companyNumber"
                formControlName="companyNumber"
                class="input-field"
                placeholder="Enter company number"
                [readonly]="isEditMode"
              />
              <div *ngIf="userForm.get('companyNumber')?.invalid && userForm.get('companyNumber')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                Company number is required
              </div>
            </div>

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
              <div *ngIf="userForm.get('teamId')?.invalid && userForm.get('teamId')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                Please select a team
              </div>
            </div>
          </div>

          <div>
            <label for="jobDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Description *
            </label>
            <textarea 
              id="jobDescription"
              formControlName="jobDescription"
              rows="3"
              class="input-field"
              placeholder="Enter job description"
            ></textarea>
            <div *ngIf="userForm.get('jobDescription')?.invalid && userForm.get('jobDescription')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
              Job description is required
            </div>
          </div>
        </form>
      </app-modal>

      <!-- Role Management Modal -->
      <app-modal
        [isOpen]="roleModalOpen"
        [title]="'Manage Roles - ' + (selectedUser?.displayName || '')"
        saveButtonText="Update Roles"
        [showFooter]="true"
        (save)="updateUserRoles()"
        (cancel)="closeRoleModal()"
        (close)="closeRoleModal()"
      >
        <div *ngIf="selectedUser" class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the roles to assign to this user:
          </p>
          
          <div class="space-y-3">
            <div *ngFor="let role of availableRoles" class="flex items-center">
              <input 
                type="checkbox" 
                [id]="'role-' + role.roleId"
                [checked]="isRoleSelected(role.roleId)"
                (change)="toggleRole(role.roleId, $event)"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label [for]="'role-' + role.roleId" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ role.roleName }}
              </label>
            </div>
          </div>

          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Current Roles:</h5>
            <div *ngIf="selectedUser.roles && selectedUser.roles.length > 0" class="flex flex-wrap gap-2">
              <span *ngFor="let userRole of selectedUser.roles" 
                    class="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                {{ userRole.role?.roleName }}
              </span>
            </div>
            <p *ngIf="!selectedUser.roles || selectedUser.roles.length === 0" 
               class="text-sm text-blue-600 dark:text-blue-400">
              No roles currently assigned.
            </p>
          </div>
        </div>
      </app-modal>

      <!-- Delete Confirmation Modal -->
      <app-modal
        [isOpen]="deleteModalOpen"
        title="Deactivate User"
        saveButtonText="Deactivate"
        (save)="confirmDelete()"
        (close)="deleteModalOpen = false"
      >
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Deactivate User?</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            This will deactivate the user account for 
            <strong>"{{ userToDelete?.displayName }}"</strong>. 
            The user will no longer be able to access the system, but their data will be preserved.
          </p>
        </div>
      </app-modal>
    </div>
  `
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  users: UserData[] = [];
  statistics: UserStatistics | null = null;
  loading = true;
  
  // Modal states
  detailModalOpen = false;
  formModalOpen = false;
  roleModalOpen = false;
  deleteModalOpen = false;
  isEditMode = false;
  selectedUser: UserData | null = null;
  userToDelete: UserData | null = null;

  // Form data
  userForm = this.createUserForm();
  teams: Team[] = [];
  availableRoles: Role[] = [];
  selectedRoleIds: number[] = [];

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'displayName', label: 'Full Name', sortable: true },
    { key: 'emailAddress', label: 'Email', sortable: true },
    { key: 'team.teamName', label: 'Team', sortable: true },
    { key: 'jobDescription', label: 'Job Title', sortable: false },
    { 
      key: 'isActive', 
      label: 'Status', 
      type: 'badge',
      badgeConfig: {
        true: { class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Active' },
        false: { class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Inactive' }
      }
    },
    { key: 'updatedAt', label: 'Last Updated', type: 'date', sortable: true }
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      action: (item) => this.viewUser(item)
    },
    {
      label: 'Edit',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      class: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
      action: (item) => this.editUser(item),
      visible: () => this.authService.isLeader()
    },
    {
      label: 'Roles',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
      class: 'text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300',
      action: (item) => this.openRoleManagementModal(item),
      visible: () => this.authService.isLeader()
    },
    {
      label: 'Deactivate',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/></svg>',
      class: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
      action: (item) => this.deleteUser(item),
      visible: (item) => this.authService.isLeader() && item.isActive
    }
  ];

  ngOnInit(): void {
    this.loadUsers();
    this.loadStatistics();
    this.loadTeams();
    this.loadRoles();
  }

  private createUserForm() {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      officePhone: [''],
      companyNumber: ['', [Validators.required]],
      teamId: ['', [Validators.required]], // Changed back to empty string to match select options
      jobDescription: ['', [Validators.required]]
    });
  }

  private loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
        this.loading = false;
      }
    });
  }

  private loadStatistics(): void {
    this.userService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  private loadTeams(): void {
    this.userService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  private loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  getTeamsAssignedCount(): string {
    return Object.keys(this.statistics?.usersByTeam || {}).length.toString() || '0';
  }

  viewUser(user: UserData): void {
    this.selectedUser = user;
    this.detailModalOpen = true;
  }

  openCreateUserModal(): void {
    this.isEditMode = false;
    this.userForm.reset();
    this.formModalOpen = true;
  }

  editUser(user: UserData): void {
    this.isEditMode = true;
    this.selectedUser = user;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      officePhone: user.officePhone,
      companyNumber: user.companyNumber,
      teamId: user.teamId.toString(), // Convert number to string
      jobDescription: user.jobDescription
    });
    this.formModalOpen = true;
  }

  deleteUser(user: UserData): void {
    this.userToDelete = user;
    this.deleteModalOpen = true;
  }

  openRoleManagementModal(user: UserData): void {
    this.selectedUser = user;
    this.selectedRoleIds = user.roles?.map(ur => ur.roleId) || [];
    this.roleModalOpen = true;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.userForm.value };
    
    if (this.isEditMode && this.selectedUser) {
      this.userService.updateUser(this.selectedUser.personnelNumber, formValue as any).subscribe({
        next: () => {
          this.notificationService.showSaveSuccess('User');
          this.loadUsers();
          this.loadStatistics();
          this.closeFormModal();
        },
        error: (error) => {
          this.notificationService.showApiError(error);
        }
      });
    } else {
      this.userService.createUser(formValue as any).subscribe({
        next: () => {
          this.notificationService.showSaveSuccess('User');
          this.loadUsers();
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
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.personnelNumber).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'User deactivated successfully');
          this.loadUsers();
          this.loadStatistics();
          this.deleteModalOpen = false;
          this.userToDelete = null;
        },
        error: (error) => {
          this.notificationService.showApiError(error);
        }
      });
    }
  }

  activateUser(user: UserData): void {
    this.userService.activateUser(user.personnelNumber).subscribe({
      next: () => {
        this.notificationService.showSuccess('Success', 'User activated successfully');
        this.loadUsers();
        this.loadStatistics();
        this.detailModalOpen = false;
      },
      error: (error) => {
        this.notificationService.showApiError(error);
      }
    });
  }

  updateUserRoles(): void {
    if (!this.selectedUser) return;

    // Get current role IDs
    const currentRoleIds = this.selectedUser.roles?.map(ur => ur.roleId) || [];
    
    // Find roles to add
    const rolesToAdd = this.selectedRoleIds.filter(roleId => !currentRoleIds.includes(roleId));
    
    // Find roles to remove
    const rolesToRemove = currentRoleIds.filter(roleId => !this.selectedRoleIds.includes(roleId));

    // Execute role changes
    const roleUpdates: any[] = [];

    rolesToAdd.forEach(roleId => {
      roleUpdates.push(
        this.userService.assignRole({
          personnelNumber: this.selectedUser!.personnelNumber,
          roleId
        })
      );
    });

    rolesToRemove.forEach(roleId => {
      roleUpdates.push(
        this.userService.removeRole(this.selectedUser!.personnelNumber, roleId)
      );
    });

    if (roleUpdates.length === 0) {
      this.closeRoleModal();
      return;
    }

    // Execute all role updates
    Promise.all(roleUpdates.map(update => update.toPromise())).then(() => {
      this.notificationService.showSuccess('Success', 'User roles updated successfully');
      this.loadUsers();
      this.closeRoleModal();
    }).catch((error) => {
      this.notificationService.showApiError(error);
    });
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  toggleRole(roleId: number, event: any): void {
    if (event.target.checked) {
      if (!this.selectedRoleIds.includes(roleId)) {
        this.selectedRoleIds.push(roleId);
      }
    } else {
      this.selectedRoleIds = this.selectedRoleIds.filter(id => id !== roleId);
    }
  }

  closeFormModal(): void {
    this.formModalOpen = false;
    this.userForm.reset();
    this.selectedUser = null;
    this.isEditMode = false;
  }

  closeRoleModal(): void {
    this.roleModalOpen = false;
    this.selectedUser = null;
    this.selectedRoleIds = [];
  }
}