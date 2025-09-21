import { Injectable, signal, computed } from '@angular/core';
import { AuthService } from './auth.service';

export type UserRole = 'leader' | 'user';

export interface RolePermissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // Current user role signal
  private currentRole = signal<UserRole>('user');
  
  // Computed permissions based on role
  public permissions = computed<RolePermissions>(() => {
    const role = this.currentRole();
    return this.getRolePermissions(role);
  });

  constructor(private authService: AuthService) {
    // Initialize role from auth service or mock data
    this.initializeRole();
  }

  /**
   * Set user role
   */
  setRole(role: UserRole): void {
    this.currentRole.set(role);
  }

  /**
   * Get current user role
   */
  getCurrentRole(): UserRole {
    return this.currentRole();
  }

  /**
   * Check if user is a leader
   */
  isLeader(): boolean {
    return this.currentRole() === 'leader';
  }

  /**
   * Check if user is a normal user
   */
  isUser(): boolean {
    return this.currentRole() === 'user';
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: keyof RolePermissions): boolean {
    return this.permissions()[permission];
  }

  /**
   * Check if user can perform CRUD operations
   */
  canPerformCRUD(): boolean {
    const perms = this.permissions();
    return perms.canCreate || perms.canUpdate || perms.canDelete;
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(role?: UserRole): string {
    const targetRole = role || this.currentRole();
    return targetRole === 'leader' ? 'Team Leader' : 'Team Member';
  }

  /**
   * Get role permissions based on role type
   */
  private getRolePermissions(role: UserRole): RolePermissions {
    switch (role) {
      case 'leader':
        return {
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
          canManageUsers: true,
          canViewReports: true,
          canExportData: true
        };
      
      case 'user':
      default:
        return {
          canCreate: false,
          canRead: true,
          canUpdate: false,
          canDelete: false,
          canManageUsers: false,
          canViewReports: true,
          canExportData: false
        };
    }
  }

  /**
   * Initialize role from authentication service or default
   */
  private initializeRole(): void {
    // In a real application, this would come from the auth service
    // For demo purposes, we'll use a mock implementation
    
    // Check if there's a saved role preference for demo
    const savedRole = localStorage.getItem('dcoe-user-role') as UserRole;
    if (savedRole && (savedRole === 'leader' || savedRole === 'user')) {
      this.setRole(savedRole);
    } else {
      // Default to user role
      this.setRole('user');
    }
  }

  /**
   * Switch role (for demo purposes)
   */
  switchRole(): void {
    const newRole = this.currentRole() === 'leader' ? 'user' : 'leader';
    this.setRole(newRole);
    localStorage.setItem('dcoe-user-role', newRole);
  }
}