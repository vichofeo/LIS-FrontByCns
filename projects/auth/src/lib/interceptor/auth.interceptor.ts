import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { environment } from '@env/environment'

import { AuthService } from '../services/auth.service'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const accessToken = authService.accessToken

  if (accessToken && !environment.debug) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
  return next(req)
}
