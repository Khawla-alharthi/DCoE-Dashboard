import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';

export type UserRole = 'leader' | 'user' | 'admin' | 'viewer';

export interface RolePermissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canManagePrograms: boolean;
  canManageTeams: boolean;
  canViewAnalytics: boolean;
  canManageRecognition: boolean;
  canAccessSettings: boolean;
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

  private authService = inject(AuthService);

  constructor() {
    // Initialize role from auth service or mock data
    this.initializeRole();
    
    // Subscribe to auth changes to update role
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.updateRoleFromUser(user);
      } else {
        this.setRole('viewer');
      }
    });
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
   * Get role permissions based on role type
   */
  private getRolePermissions(role: UserRole): RolePermissions {
    switch (role) {
      case 'admin':
        return {
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
          canManageUsers: true,
          canViewReports: true,
          canExportData: true,
          canManagePrograms: true,
          canManageTeams: true,
          canViewAnalytics: true,
          canManageRecognition: true,
          canAccessSettings: true
        };
        
      case 'leader':
        return {
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
          canManageUsers: true,
          canViewReports: true,
          canExportData: true,
          canManagePrograms: true,
          canManageTeams: true,
          canViewAnalytics: true,
          canManageRecognition: true,
          canAccessSettings: false
        };
      
      case 'user':
        return {
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: false,
          canManageUsers: false,
          canViewReports: true,
          canExportData: false,
          canManagePrograms: false,
          canManageTeams: false,
          canViewAnalytics: false,
          canManageRecognition: false,
          canAccessSettings: false
        };
        
      case 'viewer':
      default:
        return {
          canCreate: false,
          canRead: true,
          canUpdate: false,
          canDelete: false,
          canManageUsers: false,
          canViewReports: true,
          canExportData: false,
          canManagePrograms: false,
          canManageTeams: false,
          canViewAnalytics: false,
          canManageRecognition: false,
          canAccessSettings: false
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
    const roles: UserRole[] = ['viewer', 'user', 'leader', 'admin'];
    const currentIndex = roles.indexOf(this.currentRole());
    const nextIndex = (currentIndex + 1) % roles.length;
    const newRole = roles[nextIndex];
    
    this.setRole(newRole);
    localStorage.setItem('dcoe-user-role', newRole);
  }

  /**
   * Update role from authenticated user
   */
  private updateRoleFromUser(user: any): void {
    if (user.isLeader) {
      this.setRole('leader');
    } else {
      this.setRole('user');
    }
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.currentRole() === 'admin';
  }

  /**
   * Check if user is viewer only
   */
  isViewer(): boolean {
    return this.currentRole() === 'viewer';
  }

  /**
   * Get role display name with all roles
   */
  getRoleDisplayName(role?: UserRole): string {
    const targetRole = role || this.currentRole();
    const roleNames = {
      'admin': 'Administrator',
      'leader': 'Team Leader',
      'user': 'Team Member',
      'viewer': 'Viewer'
    };
    return roleNames[targetRole] || 'Unknown';
  }

  /**
   * Get role color for UI display
   */
  getRoleColor(role?: UserRole): string {
    const targetRole = role || this.currentRole();
    const roleColors = {
      'admin': 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300',
      'leader': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
      'user': 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
      'viewer': 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    };
    return roleColors[targetRole] || roleColors['viewer'];
  }

  /**
   * Get all available roles
   */
  getAllRoles(): UserRole[] {
    return ['admin', 'leader', 'user', 'viewer'];
  }
}