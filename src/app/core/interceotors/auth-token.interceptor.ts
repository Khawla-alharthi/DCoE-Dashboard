import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);
  
  // Add authorization header if token exists
  const token = oauthService.getAccessToken();
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  
  return next(req);
};
