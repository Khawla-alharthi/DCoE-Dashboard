import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="toggleTheme()" class="theme-toggle">
      <svg *ngIf="!isDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
      <svg *ngIf="isDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    </button>
  `,
  styles: [`
    .theme-toggle {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      background: white;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .theme-toggle:hover {
      background: #f9fafb;
    }
    
    .theme-toggle svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  `]
})
export class ThemeToggleComponent {
  isDark = false;
  
  toggleTheme() {
    this.isDark = !this.isDark;
    // Implement theme switching logic here
    document.documentElement.classList.toggle('dark', this.isDark);
  }
}