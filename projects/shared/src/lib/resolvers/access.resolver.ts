import { Injectable, inject } from '@angular/core'
import {
  // ActivatedRouteSnapshot,
  Resolve
  // , RouterStateSnapshot
} from '@angular/router'
import { EventBusService } from '@main/services/event-bus.service'
import { Observable, Subscription, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AccessResolver implements Resolve<boolean> {
  subscription: Subscription | undefined
  // keyMenu: any
  public eventBus = inject(EventBusService)

  resolve(
    // route: ActivatedRouteSnapshot
    // , state: RouterStateSnapshot
  ): Observable<boolean> {
    return of(true)
  }
}
