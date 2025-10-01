import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="onOverlayClick()"
    >
      <div 
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
          <button 
            (click)="onClose()"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            type="button"
            aria-label="Close modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <ng-content></ng-content>
        </div>
        
        <!-- Footer -->
        <div *ngIf="showFooter" class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            (click)="onClose()"
            class="btn-secondary"
            type="button"
          >
            {{ cancelButtonText }}
          </button>
          <button 
            *ngIf="showSaveButton"
            (click)="onSave()"
            class="btn-primary"
            [disabled]="saveDisabled"
            type="button"
          >
            {{ saveButtonText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Input() showSaveButton = true;
  @Input() saveButtonText = 'Save';
  @Input() cancelButtonText = 'Cancel';
  @Input() saveDisabled = false;
  @Input() closeOnOverlayClick = true;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onOverlayClick(): void {
    if (this.closeOnOverlayClick) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit();
  }
}