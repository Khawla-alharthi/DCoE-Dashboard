import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

interface Recognition {
  id: number;
  recipientName: string;
  team: string;
  category: string;
  description: string;
  dateAwarded: Date;
  awardedBy: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

@Component({
  selector: 'app-recognition-list',
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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Recognition & Awards</h1>
          <p class="text-gray-600 dark:text-gray-400">Acknowledge outstanding contributions and achievements</p>
        </div>
        
        <button 
          *ngIf="authService.isLeader()"
          (click)="openCreateModal()"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          New Recognition
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <app-card
          title="Total Recognitions"
          value="42"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>'
          iconColor="blue"
          [clickable]="false"
        />
        
        <app-card
          title="This Month"
          value="8"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
          iconColor="green"
          trend="+15%"
          [clickable]="false"
        />
        
        <app-card
          title="Pending Approval"
          value="3"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
          iconColor="yellow"
          [clickable]="false"
        />
        
        <app-card
          title="Categories"
          value="5"
          icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>'
          iconColor="purple"
          [clickable]="false"
        />
      </div>

      <!-- Recognition Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let recognition of recognitions" 
             class="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
             (click)="viewRecognition(recognition)">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ recognition.recipientName }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ recognition.team }}</p>
              <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {{ recognition.category }}
              </span>
            </div>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  [ngClass]="getStatusClass(recognition.status)">
              {{ recognition.status }}
            </span>
          </div>
          
          <p class="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {{ recognition.description }}
          </p>
          
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{{ recognition.dateAwarded | date:'MMM d, yyyy' }}</span>
            <span>by {{ recognition.awardedBy }}</span>
          </div>
        </div>
      </div>

      <!-- Recognition Detail Modal -->
      <app-modal
        [isOpen]="detailModalOpen"
        [title]="'Recognition Details'"
        [showFooter]="false"
        (close)="detailModalOpen = false"
      >
        <div *ngIf="selectedRecognition" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedRecognition.recipientName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
              <p class="text-gray-900 dark:text-white">{{ selectedRecognition.team }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <span class="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {{ selectedRecognition.category }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                    [ngClass]="getStatusClass(selectedRecognition.status)">
                {{ selectedRecognition.status }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Awarded</label>
              <p class="text-gray-900 dark:text-white">{{ selectedRecognition.dateAwarded | date:'fullDate' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Awarded By</label>
              <p class="text-gray-900 dark:text-white">{{ selectedRecognition.awardedBy }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <p class="text-gray-900 dark:text-white">{{ selectedRecognition.description }}</p>
          </div>
        </div>
      </app-modal>

      <!-- Create Recognition Modal -->
      <app-modal
        [isOpen]="formModalOpen"
        title="Create New Recognition"
        saveButtonText="Create Recognition"
        [showFooter]="true"
        (save)="saveRecognition()"
        (cancel)="closeFormModal()"
        (close)="closeFormModal()"
      >
        <form [formGroup]="recognitionForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="recipientName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recipient Name *
              </label>
              <input 
                type="text" 
                id="recipientName"
                formControlName="recipientName"
                class="input-field"
                placeholder="Enter recipient name"
              />
            </div>
            
            <div>
              <label for="team" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team *
              </label>
              <select 
                id="team"
                formControlName="team"
                class="input-field"
              >
                <option value="">Select a team</option>
                <option value="IDE 8">IDE 8</option>
                <option value="IDE 7">IDE 7</option>
                <option value="IDE 6">IDE 6</option>
                <option value="IDE 5">IDE 5</option>
                <option value="IDE 4">IDE 4</option>
                <option value="IDE 3">IDE 3</option>
              </select>
            </div>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select 
              id="category"
              formControlName="category"
              class="input-field"
            >
              <option value="">Select a category</option>
              <option value="AI Guidance - OQ Engagements">AI Guidance - OQ Engagements</option>
              <option value="Innovation Excellence">Innovation Excellence</option>
              <option value="Team Collaboration">Team Collaboration</option>
              <option value="Technical Achievement">Technical Achievement</option>
              <option value="Leadership">Leadership</option>
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
              placeholder="Describe the achievement or contribution..."
            ></textarea>
          </div>
        </form>
      </app-modal>
    </div>
  `
})
export class RecognitionListComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  recognitions: Recognition[] = [
    {
      id: 1,
      recipientName: 'Istabraq Al Ruhaili',
      team: 'IDE 8',
      category: 'AI Guidance - OQ Engagements',
      description: 'Outstanding contribution to AI guidance initiatives and successful collaboration with OQ on multiple strategic engagements.',
      dateAwarded: new Date('2025-08-15'),
      awardedBy: 'Team Lead',
      status: 'Approved'
    },
    {
      id: 2,
      recipientName: 'Ahmed Al Balushi',
      team: 'IDE 7',
      category: 'Innovation Excellence',
      description: 'Led the development of innovative automation solutions that resulted in significant process improvements.',
      dateAwarded: new Date('2025-08-10'),
      awardedBy: 'Department Head',
      status: 'Approved'
    },
    {
      id: 3,
      recipientName: 'Fatima Al Zahra',
      team: 'IDE 6',
      category: 'Team Collaboration',
      description: 'Exceptional teamwork and collaboration in cross-functional projects, mentoring junior team members.',
      dateAwarded: new Date('2025-08-05'),
      awardedBy: 'Project Manager',
      status: 'Pending'
    }
  ];

  // Modal states
  detailModalOpen = false;
  formModalOpen = false;
  selectedRecognition: Recognition | null = null;

  // Form
  recognitionForm = this.fb.group({
    recipientName: ['', [Validators.required]],
    team: ['', [Validators.required]],
    category: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(20)]]
  });

  ngOnInit(): void {
    // Load recognition data
  }

  openCreateModal(): void {
    this.recognitionForm.reset();
    this.formModalOpen = true;
  }

  viewRecognition(recognition: Recognition): void {
    this.selectedRecognition = recognition;
    this.detailModalOpen = true;
  }

  saveRecognition(): void {
    if (this.recognitionForm.valid) {
      const newRecognition: Recognition = {
        id: Date.now(),
        ...this.recognitionForm.value,
        dateAwarded: new Date(),
        awardedBy: 'Current User',
        status: 'Pending'
      } as Recognition;

      this.recognitions.unshift(newRecognition);
      this.notificationService.showSuccess('Success', 'Recognition created successfully');
      this.closeFormModal();
    } else {
      this.recognitionForm.markAllAsTouched();
    }
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      'Approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Declined': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  closeFormModal(): void {
    this.formModalOpen = false;
    this.recognitionForm.reset();
  }
}