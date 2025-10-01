import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../../shared/components/ui/loading-spinner.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="card p-8 text-center">
      <app-loading-spinner size="lg" message="Signing you in..."></app-loading-spinner>
    </div>
  `
})
export class CallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Handle OAuth callback
    setTimeout(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/auth/login']);
      }
    }, 2000);
  }
}
