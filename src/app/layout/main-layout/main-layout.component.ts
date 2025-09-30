import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopbarComponent } from '../../shared/components/layout/topbar.component';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent],
  template: `
    <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <!-- Topbar -->
      <app-topbar></app-topbar>
      
      <!-- Main Content Area -->
      <div class="flex-1 overflow-hidden">
        <!-- Main Content -->
        <main class="h-full overflow-y-auto">
          <!-- Page Content -->
          <div class="w-full">
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
    // Any initialization logic
  }
}