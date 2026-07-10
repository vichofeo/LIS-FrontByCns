import { HttpErrorResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router'
import { MenuService } from '@main/services/menu.service'
import { Observable, catchError, from, map, of } from 'rxjs'

import { Menu } from '../models/menu'

function hasAccess(route: string, menu: Menu[]): boolean {
  for (const item of menu) {
    if (item.data === route && item.data !== '/admin') {
      return true
    }
    if (item.children?.length > 0) {
      if (hasAccess(route, item.children)) {
        return true
      }
    }
  }
  return false
}

function hasAccessInHierarchy(route: string, menu: Menu[]): boolean {
  const routeParts = route.split('/').filter(part => part)
  while (routeParts.length > 1) {
    routeParts.pop()
    const partialRoute = `/${routeParts.join('/')}`
    if (hasAccess(partialRoute, menu) && partialRoute !== '/admin') {
      return true
    }
  }
  return false
}

export const accesGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const router = inject(Router)
  const menuService = inject(MenuService)
  const fullRoutePath = route.pathFromRoot
    .map(segment => segment.routeConfig?.path)
    .filter(Boolean)
    .join('/')

  const fullPathWithAdmin = `/${fullRoutePath}`
  return from(menuService.getMenu()).pipe(
    map(responseMenu => {
      if (!responseMenu?.recurso) {
        router.navigate(['/admin/release/msj/401'])
        return false
      }
      const menu: Menu[] = JSON.parse(responseMenu.recurso)
      const isAllowed =
        hasAccess(fullPathWithAdmin, menu) || hasAccessInHierarchy(fullPathWithAdmin, menu)
      if (!isAllowed) {
        router.navigate(['/admin/shared/aviso/401'])
      }
      return isAllowed
    }),
    catchError((error: HttpErrorResponse) => {
      const statusCode = error.status
      router.navigate([`/admin/shared/aviso/${statusCode}`])
      return of(false)
    }),
  )
}
