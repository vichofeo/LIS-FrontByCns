import { inject } from '@angular/core'
import {
  // ActivatedRouteSnapshot,
  CanActivateFn,
  // RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, tap } from 'rxjs'

import { AuthService } from '../services/auth.service'

export const authGuard: CanActivateFn = (
  // route: ActivatedRouteSnapshot,
  // state: RouterStateSnapshot,
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService)
  return authService.canActivateProtectedRoutes$.pipe(tap(
    // isAuthorized => { }
  ))
}
