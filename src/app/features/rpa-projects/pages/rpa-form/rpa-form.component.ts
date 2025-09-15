import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { RpaProjectService } from '../../../../data-access/repositories/rpa-project.repository';
import { NotificationService } from '../../../../core/services/notification.service';
import { RpaProject } from '../../../../data-access/models/rpa-project.model';

@Component({
  selector: 'app-rpa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button 
            (click)="goBack()"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ isEditMode ? 'Edit RPA Project' : 'Create New RPA Project' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ isEditMode ? 'Update project information' : 'Add a new RPA project to the system' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <div class="card p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Project Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="projectName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name *
              </label>
              <input
                id="projectName"
                type="text"
                formControlName="projectName"
                class="input-field"
                [class.border-red-300]="projectForm.get('projectName')?.invalid && projectForm.get('projectName')?.touched"
                placeholder="Enter project name"
              >
              <p *ngIf="projectForm.get('projectName')?.invalid && projectForm.get('projectName')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
                Project name is required
              </p>
            </div>

            <div>
              <label for="projectType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Type *
              </label>
              <select
                id="projectType"
                formControlName="projectType"
                class="input-field"
                [class.border-red-300]="projectForm.get('projectType')?.invalid && projectForm.get('projectType')?.touched"
              >
                <option value="">Select project type</option>
                <option value="Finance">Finance</option>
                <option value="HR">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="IT">Information Technology</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Compliance">Compliance</option>
                <option value="Other">Other</option>
              </select>
              <p *ngIf="projectForm.get('projectType')?.invalid && projectForm.get('projectType')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
                Project type is required
              </p>
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <select
                id="status"
                formControlName="status"
                class="input-field"
                [class.border-red-300]="projectForm.get('status')?.invalid && projectForm.get('status')?.touched"
              >
                <option value="">Select status</option>
                <option value="Planning">Planning</option>
                <option value="Development">Development</option>
                <option value="Production">Production</option>
                <option value="Under Discussion">Under Discussion</option>
              </select>
              <p *ngIf="projectForm.get('status')?.invalid && projectForm.get('status')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
                Status is required
              </p>
            </div>

            <div>
              <label for="directorateId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Directorate *
              </label>
              <select
                id="directorateId"
                formControlName="directorateId"
                class="input-field"
                [class.border-red-300]="projectForm.get('directorateId')?.invalid && projectForm.get('directorateId')?.touched"
              >
                <option value="">Select directorate</option>
                <option value="1">Corporate Planning (CP)</option>
                <option value="2">Exploration & Venture Development (EVD)</option>
                <option value="3">Engineering (ENG)</option>
                <option value="4">Finance (FIN)</option>
                <option value="5">Health, Safety & Environment (HSE)</option>
              </select>
              <p *ngIf="projectForm.get('directorateId')?.invalid && projectForm.get('directorateId')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
                Directorate is required
              </p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Project Metrics</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="robotsCount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Robots *
              </label>
              <input
                id="robotsCount"
                type="number"
                min="0"
                formControlName="robotsCount"
                class="input-field"
                [class.border-red-300]="projectForm.get('robotsCount')?.invalid && projectForm.get('robotsCount')?.touched"
                placeholder="0"
              >
              <p *ngIf="projectForm.get('robotsCount')?.invalid && projectForm.get('robotsCount')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
                Number of robots is required and must be positive
              </p>
            </div>

            <div>
              <label for="manhourSavings" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manhour Savings *
              </label>
              <div class="relative">
                <input
                  id="manhourSavings"
                  type="number"
                  min="0"
                  step="0.01"
                  formControlName="manhourSavings"
                  class="input-field pr-16"
                  [class.border-red-300]="projectForm.get('manhourSavings')?.invalid && projectForm.get('manhourSavings')?.touched"
                  placeholder="0"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">hours</span>
                </div>
              </div>
              <p *ngIf="projectForm.get('manhourSavings')?.invalid && projectForm.get('manhourSavings')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
                Manhour savings is required and must be positive
              </p>
            </div>

            <div>
              <label for="valueGenerated" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value Generated *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  id="valueGenerated"
                  type="number"
                  min="0"
                  step="0.01"
                  formControlName="valueGenerated"
                  class="input-field pl-7"
                  [class.border-red-300]="projectForm.get('valueGenerated')?.invalid && projectForm.get('valueGenerated')?.touched"
                  placeholder="0.00"
                >
              </div>
              <p *ngIf="projectForm.get('valueGenerated')?.invalid && projectForm.get('valueGenerated')?.touched" 
                 class="mt-1 text-sm text-red-600 dark:text-red-400">
                Value generated is required and must be positive
              </p>
            </div>
          </div>

          <!-- ROI Preview -->
          <div *ngIf="projectForm.get('robotsCount')?.value && projectForm.get('valueGenerated')?.value" 
               class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Estimated ROI</h3>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ calculateROI() }}%</p>
            <p class="text-xs text-blue-700 dark:text-blue-400">
              Based on estimated investment of $50,000 per robot
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-4 py-6">
          <button
            type="button"
            (click)="goBack()"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
            [disabled]="projectForm.invalid || loading"
          >
            <app-loading-spinner *ngIf="loading" size="sm" class="mr-2"></app-loading-spinner>
            {{ isEditMode ? 'Update Project' : 'Create Project' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class RpaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private rpaProjectService = inject(RpaProjectService);
  private notificationService = inject(NotificationService);

  projectForm: FormGroup;
  loading = false;
  isEditMode = false;
  projectId: number | null = null;

  constructor() {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(100)]],
      projectType: ['', Validators.required],
      status: ['', Validators.required],
      robotsCount: [0, [Validators.required, Validators.min(0)]],
      manhourSavings: [0, [Validators.required, Validators.min(0)]],
      valueGenerated: [0, [Validators.required, Validators.min(0)]],
      directorateId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.projectId = +params['id'];
        this.loadProject();
      }
    });
  }

  private loadProject(): void {
    if (this.projectId) {
      this.loading = true;
      this.rpaProjectService.getById(this.projectId).subscribe({
        next: (project) => {
          if (project) {
            this.projectForm.patchValue({
              projectName: project.projectName,
              projectType: project.projectType,
              status: project.status,
              robotsCount: project.robotsCount,
              manhourSavings: project.manhourSavings,
              valueGenerated: project.valueGenerated,
              directorateId: project.directorateId.toString()
            });
          } else {
            this.notificationService.showError('Error', 'Project not found');
            this.goBack();
          }
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.showError('Error', 'Failed to load project');
          this.loading = false;
          this.goBack();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.loading = true;
      const formData = {
        ...this.projectForm.value,
        directorateId: +this.projectForm.value.directorateId,
        createdBy: 'current-user' // TODO: Get from AuthService
      };

      const operation = this.isEditMode 
        ? this.rpaProjectService.update(this.projectId!, formData)
        : this.rpaProjectService.create(formData);

      operation.subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Success',
            this.isEditMode ? 'Project updated successfully' : 'Project created successfully'
          );
          this.goBack();
        },
        error: (error) => {
          this.notificationService.showError(
            'Error',
            this.isEditMode ? 'Failed to update project' : 'Failed to create project'
          );
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsTouched();
      });
    }
  }

  calculateROI(): number {
    const robotsCount = this.projectForm.get('robotsCount')?.value || 0;
    const valueGenerated = this.projectForm.get('valueGenerated')?.value || 0;
    const estimatedInvestment = robotsCount * 50000;
    return estimatedInvestment > 0 ? Math.round((valueGenerated / estimatedInvestment) * 100) : 0;
  }

  goBack(): void {
    this.router.navigate(['/rpa-projects']);
  }
}