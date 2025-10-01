import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from '../services/role.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private roleService = inject(RoleService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Check if route requires leader role
    const requiresLeader = route.data?.['requiresLeader'] || false;
    const requiredPermission = route.data?.['requiredPermission'];

    // If route requires leader role and user is not a leader
    if (requiresLeader && !this.roleService.isLeader()) {
      this.notificationService.showError(
        'Access Denied', 
        'You need leader privileges to access this page'
      );
      this.router.navigate(['/dashboard']);
      return false;
    }

    // If route requires specific permission
    if (requiredPermission && !this.roleService.hasPermission(requiredPermission)) {
      this.notificationService.showError(
        'Access Denied', 
        'You do not have permission to access this page'
      );
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}