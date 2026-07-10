import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router'
import { Observable, filter, switchMap, tap } from 'rxjs'

import { AuthService } from '../services/auth.service'

export const autWithForcedLoginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean> => {
  const authService = inject(AuthService)
  return authService.isDoneLoading$.pipe(
    filter(isDone => isDone),
    switchMap(() => authService.isAuthenticated$),
    tap(isAuthenticated => isAuthenticated || authService.login(state.url)),
  )
}
