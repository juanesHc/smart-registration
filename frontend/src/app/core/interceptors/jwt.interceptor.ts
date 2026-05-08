import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CookieService } from '../services/cookie/cookie.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.getToken();

  const isBackendRequest =
    req.url.startsWith(environment.apiUrlJava) || req.url.startsWith(environment.apiUrlPython);

  // TEMP DEBUG — remove after diagnosing 401 issue
  console.log('[jwt-interceptor]', {
    url: req.url,
    apiUrlJava: environment.apiUrlJava,
    isBackendRequest,
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 20) + '...' : null
  });

  if (token && isBackendRequest) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
