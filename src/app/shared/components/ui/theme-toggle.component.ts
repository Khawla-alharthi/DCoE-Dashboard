import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="toggleTheme()" 
      class="theme-toggle"
      [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <svg *ngIf="!isDark" class="icon sun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
      <svg *ngIf="isDark" class="icon moon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
    </button>
  `,
  styles: [`
    .theme-toggle {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      padding: 0;
      
      &:hover {
        background: #f5f5f7;
      }
      
      .dark & {
        &:hover {
          background: #3a3a3c;
        }
      }
    }
    
    .icon {
      width: 20px;
      height: 20px;
      color: #1d1d1f;
      transition: transform 0.3s ease;
      
      .dark & {
        color: #f5f5f7;
      }
      
      &.sun {
        animation: rotate 20s linear infinite;
      }
      
      &.moon {
        animation: pulse 2s ease-in-out infinite;
      }
    }
    
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  private themeService = inject(ThemeService);
  isDark = false;
  
  ngOnInit(): void {
    this.isDark = this.themeService.isDark();
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDark = this.themeService.isDark();
  }
}