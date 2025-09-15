import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarComponent],
  template: `
    <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <!-- Topbar -->
      <app-topbar></app-topbar>
      
      <!-- Main Content Area -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar -->
        <app-sidebar></app-sidebar>
        
        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto relative">
          <!-- Mobile Sidebar Overlay -->
          <div 
            *ngIf="(layoutService.sidebarOpen$ | async) && isMobile()"
            class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            (click)="layoutService.setSidebarOpen(false)"
          ></div>
          
          <!-- Page Content -->
          <div class="p-4 sm:p-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  layoutService = inject(LayoutService);
  private router = inject(Router);

  ngOnInit(): void {
    // Close sidebar on mobile after navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMobileSidebar();
      });
  }

  // Add a method to check if device is mobile
  isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  private closeMobileSidebar(): void {
    // Close sidebar on mobile screens (less than 1024px)
    this.layoutService.sidebarOpen$.subscribe(isOpen => {
      if (this.isMobile() && isOpen) {
        this.layoutService.setSidebarOpen(false);
      }
    }).unsubscribe(); // Immediately unsubscribe since this is a one-time check
  }
}