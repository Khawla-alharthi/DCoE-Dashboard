import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [ngClass]="containerClass">
      <div class="animate-spin rounded-full border-b-2 border-primary-500" [ngClass]="spinnerClass"></div>
      <span *ngIf="message" class="ml-3 text-gray-600 dark:text-gray-400">{{ message }}</span>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message = '';
  @Input() containerClass = 'p-4';

  get spinnerClass(): string {
    const sizeMap = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
    return sizeMap[this.size];
  }
}
