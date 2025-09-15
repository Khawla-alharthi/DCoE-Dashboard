import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <router-outlet></router-outlet>
      
      <!-- Toast Notifications -->
      <div class="fixed top-4 right-4 z-50 space-y-2">
        <!-- Notification components will be rendered here -->
      </div>
    </div>
  `
})
export class AppComponent {  
  title = 'dcoe-dashboard';
}