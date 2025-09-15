import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="card p-6 hover:shadow-md transition-all cursor-pointer"
      [class.hover:scale-105]="clickable"
      (click)="onCardClick()"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ title }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
          <p *ngIf="subtitle" class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ subtitle }}</p>
        </div>
        <div 
          class="p-3 rounded-full"
          [ngClass]="getIconBgClass()"
        >
          <span [innerHTML]="icon" class="w-6 h-6 text-white"></span>
        </div>
      </div>
      
      <div *ngIf="trend" class="flex items-center mt-4">
        <span 
          class="text-sm font-medium"
          [ngClass]="getTrendClass()"
        >
          {{ trend }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() iconColor: 'blue' | 'green' | 'yellow' | 'red' | 'purple' = 'blue';
  @Input() trend = '';
  @Input() clickable = true;
  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }

  getIconBgClass(): string {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };
    return colorMap[this.iconColor];
  }

  getTrendClass(): string {
    if (this.trend.includes('+')) {
      return 'text-green-600 dark:text-green-400';
    } else if (this.trend.includes('-')) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  }
}
