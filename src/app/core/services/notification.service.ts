import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private defaultDuration = 5000; // 5 seconds

  constructor() {}

  // Show success notification
  showSuccess(title: string, message: string, duration?: number): void {
    this.show({
      type: 'success',
      title,
      message,
      duration: duration || this.defaultDuration
    });
  }

  // Show error notification
  showError(title: string, message: string, persistent = false): void {
    this.show({
      type: 'error',
      title,
      message,
      duration: persistent ? 0 : this.defaultDuration,
      persistent
    });
  }

  // Show warning notification
  showWarning(title: string, message: string, duration?: number): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration: duration || this.defaultDuration
    });
  }

  // Show info notification
  showInfo(title: string, message: string, duration?: number): void {
    this.show({
      type: 'info',
      title,
      message,
      duration: duration || this.defaultDuration
    });
  }

  // Generic show method
  private show(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date()
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto-dismiss if duration is set and > 0
    if (notification.duration && notification.duration > 0) {
      timer(notification.duration)
        .pipe(take(1))
        .subscribe(() => {
          this.dismiss(newNotification.id);
        });
    }
  }

  // Dismiss notification by ID
  dismiss(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  // Clear all notifications
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  // Clear notifications by type
  clearByType(type: Notification['type']): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.type !== type);
    this.notificationsSubject.next(filteredNotifications);
  }

  // Get current notifications
  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  // Generate unique ID
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convenience methods for common scenarios
  showApiError(error: any): void {
    let message = 'An unexpected error occurred. Please try again.';
    let title = 'Error';

    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    }

    if (error?.status) {
      title = `Error ${error.status}`;
    }

    this.showError(title, message);
  }

  showSaveSuccess(itemType: string = 'Item'): void {
    this.showSuccess('Success', `${itemType} saved successfully!`);
  }

  showDeleteSuccess(itemType: string = 'Item'): void {
    this.showSuccess('Success', `${itemType} deleted successfully!`);
  }

  showValidationError(message: string = 'Please check your input and try again.'): void {
    this.showError('Validation Error', message);
  }

  showNetworkError(): void {
    this.showError(
      'Network Error',
      'Unable to connect to the server. Please check your connection.',
      true // persistent
    );
  }

  showUnauthorizedError(): void {
    this.showError(
      'Access Denied',
      'You do not have permission to perform this action.',
      true // persistent
    );
  }

  showMaintenanceNotice(): void {
    this.showWarning(
      'System Maintenance',
      'The system will be under maintenance tonight from 10:00 PM to 2:00 AM.',
      10000 // 10 seconds
    );
  }
}