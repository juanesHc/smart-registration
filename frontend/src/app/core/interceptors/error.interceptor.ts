import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { AuthService } from '../services/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialogService = inject(DialogService);
  const translate = inject(TranslateService);

  const showError = (key: string): void => {
    dialogService.error(
      translate.instant(`errors.${key}`),
      translate.instant('ui.BUTTON_OK')
    );
  };

  const isBackendRequest =
    req.url.startsWith(environment.apiUrlJava) || req.url.startsWith(environment.apiUrlPython);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!isBackendRequest) {
        return throwError(() => error);
      }

      const isLoginEndpoint = req.url.includes('/auth/login');
      const isAccountEndpoint = req.url.includes('/account/me');

      if (error.status === 401 && !isLoginEndpoint) {
        authService.logout();
        showError('TOKEN_INVALID');
        return throwError(() => error);
      }

      if (error.status === 404 && isAccountEndpoint) {
        authService.logout();
        showError('PERSON_NOT_FOUND');
        return throwError(() => error);
      }

      if (error.status === 0) {
        showError('INTERNAL_ERROR');
        return throwError(() => error);
      }

      if (error.status === 404 && !isLoginEndpoint && !isAccountEndpoint) {
        void router.navigate(['/not-found']);
      }

      return throwError(() => error);
    })
  );
};
