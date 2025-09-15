import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  displayName: string;
  email: string;
  isLeader: boolean;
  roleId: number;
  roleName: string;
  directorateId?: number;
  directorate?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Demo users for testing
  private demoUsers: User[] = [
    {
      id: 1,
      displayName: 'Ahmed Al-Rashid',
      email: 'ahmed.alrashid@pdo.co.om',
      isLeader: true,
      roleId: 1,
      roleName: 'DCoE Leader',
      directorateId: 1,
      directorate: 'Upstream'
    },
    {
      id: 2,
      displayName: 'Sarah Johnson',
      email: 'sarah.johnson@pdo.co.om',
      isLeader: false,
      roleId: 2,
      roleName: 'RPA Developer',
      directorateId: 2,
      directorate: 'IT'
    }
  ];

  constructor(private router: Router) {
    // Check for existing session on service initialization
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const storedUser = localStorage.getItem('dcoe_current_user');
    const storedToken = localStorage.getItem('dcoe_auth_token');
    
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Demo login method
  login(credentials: LoginCredentials): Observable<boolean> {
    return new Observable(observer => {
      // Simulate API delay
      setTimeout(() => {
        let user: User | undefined;

        // Demo login logic
        if (credentials.username === 'demo.leader' && credentials.password === 'password') {
          user = this.demoUsers[0];
        } else if (credentials.username === 'demo.user' && credentials.password === 'password') {
          user = this.demoUsers[1];
        }

        if (user) {
          // Store authentication data
          const token = this.generateDemoToken();
          localStorage.setItem('dcoe_auth_token', token);
          localStorage.setItem('dcoe_current_user', JSON.stringify(user));
          
          // Update subjects
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  // SSO login method (for future integration)
  loginWithSSO(): Observable<boolean> {
    // TODO: Implement actual SSO login
    // This would integrate with angular-oauth2-oidc
    return of(false).pipe(delay(1000));
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('dcoe_auth_token');
    localStorage.removeItem('dcoe_current_user');
    
    // Update subjects
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Navigate to login
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isLeader(): boolean {
    const user = this.getCurrentUser();
    return user?.isLeader ?? false;
  }

  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user?.roleName === roleName;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('dcoe_auth_token');
  }

  // Utility method to generate demo token
  private generateDemoToken(): string {
    return 'demo_token_' + Math.random().toString(36).substr(2, 9);
  }

  // Method to refresh token (for future API integration)
  refreshToken(): Observable<boolean> {
    // TODO: Implement actual token refresh
    return of(true);
  }

  // Method to check if token is expired
  isTokenExpired(): boolean {
    // TODO: Implement actual token expiry check
    // For demo purposes, always return false
    return false;
  }
}