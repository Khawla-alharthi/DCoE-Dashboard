import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideCharts } from 'ng2-charts';

import { routes } from './app.routes';
import { AuthTokenInterceptor } from './core/interceotors/auth-token.interceptor';
import { HttpErrorInterceptor } from './core/interceotors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthTokenInterceptor, HttpErrorInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(OAuthModule.forRoot()),
    provideCharts()
  ]

};