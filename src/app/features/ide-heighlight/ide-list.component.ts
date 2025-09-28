import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../shared/components/layout/modal.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner.component';
import { HighlightsService, HighlightStatistics } from '../../data-access/repositories/ide-highlights.repository';
import { UserService } from '../../data-access/repositories/user.repository';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { IdeHighlight } from '../../data-access/models/ide-highlight.model';
import { UserData } from '../../data-access/models/user-data.model';

@Component({
  selector: 'app-highlights-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">IDE Highlights</h1>
          <p class="text-gray-600 dark:text-gray-400">Showcase achievements and contributions</p>
        </div>
        
        <button 
          *ngIf="authService.isLeader()"
          (click)="openCreateHighlightModal()"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          New Highlight
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6" *ngIf="!loading">
        <app-card
          title="Total Highlights"
          [value]="statistics?.totalHighlights?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
          iconColor="blue"
          [clickable]="false"
        />
        
        <app-card
          title="Contributors"
          [value]="statistics?.totalRecipients?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
          iconColor="green"
          [clickable]="false"
        />
        
        <app-card
          title="This Month"
          [value]="statistics?.highlightsThisMonth?.toString() || '0'"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
          iconColor="purple"
          trend="+20%"
          [clickable]="false"
        />
        
        <app-card
          title="Categories"
          [value]="getHighlightTypesCount().toString()"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>'
          iconColor="red"
          [clickable]="false"
        />
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <app-loading-spinner />
      </div>

      <!-- View Mode Toggle -->
      <div *ngIf="!loading" class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button 
            (click)="viewMode = 'table'"
            [class]="viewMode === 'table' ? 'btn-primary' : 'btn-secondary'"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2zM21 17V7m0 10a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2z"/>
            </svg>
            Table View
          </button>
          <button 
            (click)="viewMode = 'timeline'"
            [class]="viewMode === 'timeline' ? 'btn-primary' : 'btn-secondary'"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Timeline View
          </button>
        </div>
        
        <!-- Filter by Type -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">Filter:</label>
          <select 
            [(ngModel)]="selectedTypeFilter"
            (ngModelChange)="applyTypeFilter()"
            class="input-field text-sm py-1 px-2"
          >
            <option value="">All Types</option>
            <option *ngFor="let type of highlightTypes" [value]="type">{{ type }}</option>
          </select>
        </div>
      </div>

      <!-- Table View -->
      <div *ngIf="viewMode === 'table' && !loading">
        <app-data-table
          title="IDE Highlights"
          entityName="Highlight"
          [data]="filteredHighlights"
          [columns]="tableColumns"
          [actions]="tableActions"
          [showAddButton]="false"
          (rowClick)="viewHighlight($event)"
          (addClick)="openCreateHighlightModal()"
        />
      </div>

      <!-- Timeline View -->
      <div *ngIf="viewMode === 'timeline' && !loading" class="space-y-6">
        <div *ngFor="let highlight of filteredHighlights; let i = index" 
             class="relative">
          <!-- Timeline connector -->
          <div *ngIf="i < filteredHighlights.length - 1" 
               class="absolute left-6 top-16 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
          
          <!-- Timeline item -->
          <div class="relative flex items-start space-x-4">
            <!-- Timeline dot -->
            <div class="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center relative z-10">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            
            <!-- Highlight content -->
            <div class="flex-1 min-w-0">
              <div class="card p-6 cursor-pointer hover:shadow-md transition-shadow" 
                   (click)="viewHighlight(highlight)">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ highlight.highlightTitle }}
                      </h3>
                      <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {{ highlight.highlightType }}
                      </span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {{ highlight.description }}
                    </p>
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {{ highlight.highlightDate | date:'fullDate' }}
                      <span class="mx-2">•</span>
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      {{ highlight.recipients?.length || 0 }} contributors
                      <span class="mx-2">•</span>
                      <span class="text-gray-400">{{ highlight.createdBy }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                <!-- Contributors preview -->
                <div *ngIf="highlight.recipients && highlight.recipients.length > 0" class="border-t pt-3">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Contributors:</span>
                    <div class="flex -space-x-1">
                      <div *ngFor="let recipient of highlight.recipients.slice(0, 3)" 
                           class="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <span class="text-xs font-medium text-yellow-600 dark:text-yellow-300">
                          {{ recipient.user?.firstName?.charAt(0) || 'U' }}
                        </span>
                      </div>
                      <div *ngIf="highlight.recipients.length > 3" 
                           class="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <span class="text-xs text-gray-600 dark:text-gray-300">+{{ highlight.recipients.length - 3 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredHighlights.length === 0" 
             class="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <p>No highlights found{{ selectedTypeFilter ? ' for the selected type' : '' }}.</p>
          <p *ngIf="authService.isLeader()" class="mt-2">
            <button (click)="openCreateHighlightModal()" class="text-blue-600 hover:text-blue-800">
              Create your first highlight
            </button>
          </p>
        </div>
      </div>

      <!-- Detail Modal -->
      <app-modal
        [isOpen]="detailModalOpen"
        [title]="selectedHighlight?.highlightTitle || 'Highlight Details'"
        [showFooter]="false"
        (close)="detailModalOpen = false"
      >
        <div *ngIf="selectedHighlight" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {{ selectedHighlight.highlightType }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <p class="text-gray-900 dark:text-white">{{ selectedHighlight.highlightDate | date:'fullDate' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <p class="text-gray-900 dark:text-white whitespace-pre-line">{{ selectedHighlight.description }}</p>
          </div>
        </div>
      </app-modal>

      <!-- Form Modal -->
      <app-modal
        [isOpen]="formModalOpen"
        [title]="isEditMode ? 'Edit Highlight' : 'Create New Highlight'"
        saveButtonText="Save Highlight"
        [showFooter]="true"
        (save)="saveHighlight()"
        (cancel)="closeFormModal()"
        (close)="closeFormModal()"
      >
        <form [formGroup]="highlightForm" class="space-y-4">
          <!-- Form fields would go here -->
        </form>
      </app-modal>

      <!-- Contributor Modal -->
      <app-modal
        [isOpen]="contributorModalOpen"
        title="Select Contributors"
        saveButtonText="Add Selected"
        [showFooter]="true"
        (save)="addSelectedContributors()"
        (cancel)="closeContributorModal()"
        (close)="closeContributorModal()"
      >
        <!-- Contributor selection would go here -->
      </app-modal>

      <!-- Delete Modal -->
      <app-modal
        [isOpen]="deleteModalOpen"
        title="Delete Highlight"
        saveButtonText="Delete"
        (save)="confirmDelete()"
        (close)="deleteModalOpen = false"
      >
        <!-- Delete confirmation content -->
      </app-modal>
    </div>
  `
})
export class HighlightsListComponent implements OnInit {
  private highlightsService = inject(HighlightsService);
  private userService = inject(UserService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  highlights: IdeHighlight[] = [];
  filteredHighlights: IdeHighlight[] = [];
  statistics: HighlightStatistics | null = null;
  loading = true;
  viewMode: 'table' | 'timeline' = 'timeline';
  selectedTypeFilter = '';
  maxDate = new Date().toISOString().split('T')[0];
  
  // Modal states
  detailModalOpen = false;
  formModalOpen = false;
  contributorModalOpen = false;
  deleteModalOpen = false;
  isEditMode = false;
  selectedHighlight: IdeHighlight | null = null;
  highlightToDelete: IdeHighlight | null = null;

  // Form data
  highlightForm: FormGroup = this.createHighlightForm();
  highlightTypes: string[] = [];
  allUsers: UserData[] = [];
  filteredUsers: UserData[] = [];
  selectedContributors: any[] = [];
  contributorSearchQuery = '';

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'highlightTitle', label: 'Title', sortable: true },
    { key: 'highlightType', label: 'Type', sortable: true },
    { 
      key: 'recipients.length', 
      label: 'Contributors', 
      type: 'number', 
      sortable: true, 
      width: '120px'
    },
    { key: 'highlightDate', label: 'Date', type: 'date', sortable: true },
    { key: 'createdBy', label: 'Created By', sortable: true }
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      action: (item) => this.viewHighlight(item)
    },
    {
      label: 'Edit',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
      class: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
      action: (item) => this.editHighlight(item),
      visible: () => this.authService.isLeader()
    },
    {
      label: 'Delete',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
      class: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
      action: (item) => this.deleteHighlight(item),
      visible: () => this.authService.isLeader()
    }
  ];

  ngOnInit(): void {
    this.loadHighlights();
    this.loadStatistics();
    this.loadHighlightTypes();
    this.loadUsers();
  }

  private createHighlightForm(): FormGroup {
    return this.fb.group({
      highlightTitle: ['', [Validators.required, Validators.minLength(5)]],
      highlightType: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      highlightDate: ['', [Validators.required]]
    });
  }

  getHighlightTypesCount(): number {
    if (!this.statistics?.highlightsByType) {
      return 0;
    }
    const keys = Object.keys(this.statistics.highlightsByType);
    return keys.length;
  }

  private loadHighlights(): void {
    this.loading = true;
    this.highlightsService.getAllHighlights().subscribe({
      next: (highlights) => {
        this.highlights = highlights.sort((a, b) => 
          new Date(b.highlightDate).getTime() - new Date(a.highlightDate).getTime()
        );
        this.applyTypeFilter();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'Failed to load highlights');
        this.loading = false;
      }
    });
  }

  private loadStatistics(): void {
    this.highlightsService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'Failed to load statistics');
      }
    });
  }

  private loadHighlightTypes(): void {
    this.highlightsService.getHighlightTypes().subscribe({
      next: (types) => {
        this.highlightTypes = types;
      },
      error: (error) => {
        this.notificationService.showError('Error', 'Failed to load highlight types');
      }
    });
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users.filter(u => u.isActive);
        this.filteredUsers = [...this.allUsers];
      },
      error: (error) => {
        this.notificationService.showError('Error', 'Failed to load users');
      }
    });
  }

  applyTypeFilter(): void {
    if (this.selectedTypeFilter) {
      this.filteredHighlights = this.highlights.filter(h => h.highlightType === this.selectedTypeFilter);
    } else {
      this.filteredHighlights = [...this.highlights];
    }
  }

  viewHighlight(highlight: IdeHighlight): void {
    this.selectedHighlight = highlight;
    this.detailModalOpen = true;
  }

  openCreateHighlightModal(): void {
    this.isEditMode = false;
    this.highlightForm.reset();
    this.selectedContributors = [];
    this.formModalOpen = true;
  }

  editHighlight(highlight: IdeHighlight): void {
    this.isEditMode = true;
    this.selectedHighlight = highlight;
    this.highlightForm.patchValue({
      highlightTitle: highlight.highlightTitle,
      highlightType: highlight.highlightType,
      description: highlight.description,
      highlightDate: highlight.highlightDate.toISOString().split('T')[0]
    });
    
    this.selectedContributors = highlight.recipients?.map(r => ({
      personnelNumber: r.personnelNumber,
      teamId: r.teamId,
      user: r.user,
      team: r.team
    })) || [];
    
    this.formModalOpen = true;
  }

  deleteHighlight(highlight: IdeHighlight): void {
    this.highlightToDelete = highlight;
    this.deleteModalOpen = true;
  }

  saveHighlight(): void {
    if (this.highlightForm.invalid) {
      this.highlightForm.markAllAsTouched();
      return;
    }

    const formValue = this.highlightForm.value;
    const highlightRequest = {
      ...formValue,
      highlightDate: new Date(formValue.highlightDate),
      recipients: this.selectedContributors.map(r => ({
        personnelNumber: r.personnelNumber,
        teamId: r.teamId
      }))
    };
    
    if (this.isEditMode && this.selectedHighlight) {
      this.highlightsService.updateHighlight(this.selectedHighlight.highlightId, highlightRequest).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'Highlight updated successfully');
          this.loadHighlights();
          this.loadStatistics();
          this.closeFormModal();
        },
        error: (error) => {
          this.notificationService.showError('Error', 'Failed to update highlight');
        }
      });
    } else {
      this.highlightsService.createHighlight(highlightRequest).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'Highlight created successfully');
          this.loadHighlights();
          this.loadStatistics();
          this.closeFormModal();
        },
        error: (error) => {
          this.notificationService.showError('Error', 'Failed to create highlight');
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.highlightToDelete) {
      this.highlightsService.deleteHighlight(this.highlightToDelete.highlightId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success', 'Highlight deleted successfully');
          this.loadHighlights();
          this.loadStatistics();
          this.deleteModalOpen = false;
          this.highlightToDelete = null;
        },
        error: (error) => {
          this.notificationService.showError('Error', 'Failed to delete highlight');
        }
      });
    }
  }

  openContributorModal(): void {
    this.contributorSearchQuery = '';
    this.filteredUsers = [...this.allUsers];
    this.contributorModalOpen = true;
  }

  closeContributorModal(): void {
    this.contributorModalOpen = false;
    this.contributorSearchQuery = '';
  }

  filterUsers(): void {
    const query = this.contributorSearchQuery.toLowerCase();
    this.filteredUsers = this.allUsers.filter(user =>
      user.displayName.toLowerCase().includes(query) ||
      user.emailAddress.toLowerCase().includes(query) ||
      user.jobDescription.toLowerCase().includes(query) ||
      user.team?.teamName.toLowerCase().includes(query)
    );
  }

  isUserSelected(personnelNumber: string): boolean {
    return this.selectedContributors.some(r => r.personnelNumber === personnelNumber);
  }

  toggleUserSelection(user: UserData, event: any): void {
    if (event.target.checked) {
      if (!this.isUserSelected(user.personnelNumber)) {
        this.selectedContributors.push({
          personnelNumber: user.personnelNumber,
          teamId: user.teamId,
          user: user,
          team: user.team
        });
      }
    } else {
      this.selectedContributors = this.selectedContributors.filter(
        r => r.personnelNumber !== user.personnelNumber
      );
    }
  }

  addSelectedContributors(): void {
    this.closeContributorModal();
    if (this.selectedContributors.length > 0) {
      this.notificationService.showInfo('Contributors Selected', `${this.selectedContributors.length} contributor(s) selected`);
    }
  }

  removeContributor(contributor: any): void {
    this.selectedContributors = this.selectedContributors.filter(
      r => r.personnelNumber !== contributor.personnelNumber
    );
  }

  closeFormModal(): void {
    this.formModalOpen = false;
    this.highlightForm.reset();
    this.selectedHighlight = null;
    this.isEditMode = false;
    this.selectedContributors = [];
  }
}