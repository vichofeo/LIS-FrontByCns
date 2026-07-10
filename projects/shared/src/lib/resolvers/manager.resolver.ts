import { inject } from '@angular/core'
import {
  // ActivatedRouteSnapshot
   ResolveFn
  // , RouterStateSnapshot
} from '@angular/router'
import { EventBusService } from '@main/services/event-bus.service'
import { from, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { LocalStorage } from '../services/local-storage'

let keyMenu: unknown = null

export const managerResolver: ResolveFn<boolean> = (
  // route: ActivatedRouteSnapshot,
  // state: RouterStateSnapshot,
) => {
  const localStorage = inject(LocalStorage)
  const eventBus = inject(EventBusService)
  try {
    eventBus.on('menuClicked', data => {
      keyMenu = data
    })
    const menuData = keyMenu as {
      menu?: {
        id?: string | number
        label?: string
      }
    }
    if (menuData?.menu?.id) {
      return from(eventBus.getAccess(menuData)).pipe(
        switchMap((data: unknown) => {
          if (menuData.menu?.label) {
            localStorage.removeKey(menuData.menu.label)
            localStorage.setKey(menuData.menu.label, JSON.stringify(data))
          }
          return of(true)
        }),
      )
    }
    return of(true)
  } catch {
    return of(true)
  }
}
