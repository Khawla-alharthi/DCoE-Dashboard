import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ProgramRepository, Program as RepoProgram } from '../../data-access/repositories/program.repository';
import { AuthService } from '../../core/services/auth.service';

// Use the Program interface from the repository instead of the model
interface Program extends RepoProgram {
  // Add the missing properties that the component expects
  phase?: string;
  comments?: string;
  createdBy?: string;
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalComponent, CardComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Digital Ambition Program</h1>
        <p class="text-gray-600 dark:text-gray-400">Track progress of digital transformation initiatives</p>
      </div>

      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <app-card
          title="Total Products"
          value="37"
          iconColor="blue"
          [clickable]="false"
        />
        <app-card
          title="Value Generated"
          value="$7.97M"
          iconColor="green"
          trend="+12%"
          [clickable]="false"
        />
        <app-card
          title="Actual %"
          value="81%"
          iconColor="yellow"
          trend="+5%"
          [clickable]="false"
        />
        <app-card
          title="External Engagements"
          value="9"
          iconColor="red"
          [clickable]="false"
        />
      </div>

      <!-- Programs Table -->
      <app-data-table
        title="Program Status Overview"
        entityName="Program"
        [data]="programs"
        [columns]="tableColumns"
        [actions]="tableActions"
        [showAddButton]="authService.isLeader()"
        (rowClick)="viewProgram($event)"
      />

      <!-- FIXED: Program Detail Modal with proper binding -->
      <app-modal
        [isOpen]="detailModalOpen"
        [title]="selectedProgram?.programName || 'Program Details'"
        [showFooter]="false"
        (close)="detailModalOpen = false"
      >
        <div *ngIf="selectedProgram" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Name</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedProgram.programName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <span class="inline-flex px-2 py-1 text-sm font-semibold rounded-full"
                    [ngClass]="getStatusBadgeClass(selectedProgram.status)">
                {{ selectedProgram.status }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Progress</label>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" 
                     [style.width.%]="selectedProgram.progress"></div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ selectedProgram.progress }}% Complete</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Updated</label>
              <p class="text-gray-900 dark:text-white">{{ selectedProgram.updatedAt | date:'short' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget</label>
              <p class="text-gray-900 dark:text-white">\${{ (selectedProgram.budget / 1000000).toFixed(1) }}M</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spent</label>
              <p class="text-gray-900 dark:text-white">\${{ (selectedProgram.actualSpent / 1000000).toFixed(1) }}M</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value Generated</label>
              <p class="text-green-600 dark:text-green-400 font-semibold">\${{ (selectedProgram.valueGenerated / 1000000).toFixed(1) }}M</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RPA Projects</label>
              <p class="text-gray-900 dark:text-white">{{ selectedProgram.rpaProjectsCount }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <p class="text-gray-900 dark:text-white">{{ selectedProgram.description }}</p>
          </div>

          <!-- Objectives Section -->
          <div *ngIf="selectedProgram.objectives && selectedProgram.objectives.length > 0">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Objectives</label>
            <ul class="list-disc list-inside space-y-1">
              <li *ngFor="let objective of selectedProgram.objectives" 
                  class="text-sm text-gray-600 dark:text-gray-400">
                {{ objective }}
              </li>
            </ul>
          </div>

          <!-- Key Results Section -->
          <div *ngIf="selectedProgram.keyResults && selectedProgram.keyResults.length > 0">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Results</label>
            <ul class="list-disc list-inside space-y-1">
              <li *ngFor="let result of selectedProgram.keyResults" 
                  class="text-sm text-gray-600 dark:text-gray-400">
                {{ result }}
              </li>
            </ul>
          </div>
        </div>
      </app-modal>
    </div>
  `
})
export class ProgramsComponent implements OnInit {
  private programService = inject(ProgramRepository);
  public authService = inject(AuthService);

  programs: Program[] = [];
  detailModalOpen = false;
  selectedProgram: Program | null = null;

  tableColumns: TableColumn[] = [
    { key: 'programName', label: 'Program Name', sortable: true },
    { key: 'directorate', label: 'Directorate', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'progress', label: 'Progress (%)', type: 'number', sortable: true },
    { 
      key: 'status', 
      label: 'Status Badge', 
      type: 'badge',
      badgeConfig: {
        'Planning': { class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', label: 'Planning' },
        'Active': { class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Active' },
        'Completed': { class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', label: 'Completed' },
        'On Hold': { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'On Hold' }
      }
    },
    { key: 'updatedAt', label: 'Last Updated', type: 'date', sortable: true }
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      action: (item) => this.viewProgram(item)
    }
  ];

  ngOnInit(): void {
    this.loadPrograms();
  }

  private loadPrograms(): void {
    this.programService.getAll().subscribe({
      next: (programs) => {
        // Transform the repository Program to component Program by adding missing properties
        this.programs = programs.map(program => ({
          ...program,
          phase: this.getPhaseFromStatus(program.status),
          comments: program.description || 'No comments available',
          createdBy: program.leaderName || 'System'
        }));
      },
      error: (error) => {
        console.error('Failed to load programs:', error);
      }
    });
  }

  private getPhaseFromStatus(status: string): string {
    const phaseMap: { [key: string]: string } = {
      'Planning': 'Phase 1 - Planning',
      'Active': 'Phase 2 - Execution', 
      'Completed': 'Phase 3 - Complete',
      'On Hold': 'Phase 0 - On Hold'
    };
    return phaseMap[status] || 'Unknown Phase';
  }

  viewProgram(program: Program): void {
    this.selectedProgram = program;
    this.detailModalOpen = true;
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses = {
      'Planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Completed': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'On Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }
}