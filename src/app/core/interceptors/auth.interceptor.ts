// src/app/core/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const organizationId = authService.getOrganizationId();

  // No agregar headers a requests que no sean a nuestra API
  if (!req.url.includes('/api')) {
    return next(req);
  }

  // Clonar request y agregar headers
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  if (organizationId) {
    authReq = authReq.clone({
      setHeaders: {
        'X-Organization-Id': organizationId
      }
    });
  }

  return next(authReq);
};
