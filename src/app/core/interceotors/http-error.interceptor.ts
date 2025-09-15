import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized access. Please log in again.';
          authService.logout();
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
      }

      // Show notification for client errors (4xx) and server errors (5xx)
      if (error.status >= 400) {
        notificationService.showError('Error', errorMessage);
      }

      return throwError(() => error);
    })
  );
};