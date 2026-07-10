/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

import { MenuService } from './menu.service'

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private dataSource = new BehaviorSubject<unknown>(null)
  // eslint-disable-next-line @typescript-eslint/member-ordering
  data = this.dataSource.asObservable()
  private menuService = inject(MenuService)

  emit(event: unknown) {
    this.dataSource.next(event)
  }

  on(eventName: string, action: (data: unknown) => void) {
    return this.dataSource
      .pipe(
        filter((e: any) => e?.name === eventName),
        map((e: any) => e['data']),
      )
      .subscribe(action)
  }

  getAccess(data: any) {
    const menuId = data?.menu?.rolRecursoId ? data?.menu?.rolRecursoId : data?.menu?.id
    return this.menuService.getAccess(data.user, menuId)
  }
}
