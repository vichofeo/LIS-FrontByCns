import { CommonModule } from '@angular/common'
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router'
import { Subscription, filter } from 'rxjs'

import { AuthService } from 'auth'

import { Layout } from '../../pages/layout/layout'
import { EventBusService } from '../../services/event-bus.service'
import { MenuService } from '../../services/menu.service'

@Component({
  selector: '[app-menuitem]',
  imports: [CommonModule, FormsModule, RouterModule, Menuitem],
  templateUrl: './menuitem.html',
  styleUrl: './menuitem.scss',
  host: {
    '[class.active-menuitem]': 'active',
  },
})
export class Menuitem implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() item: any
  @Input() index = 0
  @Input() root = false
  @Input() parentKey = ''

  active = false
  menuSourceSubscription: Subscription
  menuResetSubscription: Subscription
  key = ''
  public layout = inject(Layout)
  public router = inject(Router)
  public route = inject(ActivatedRoute)
  public eventBus = inject(EventBusService)
  private menuService = inject(MenuService)
  private authService = inject(AuthService)

  constructor() {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe(key => {
      // deactivate current active menu
      if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
        this.active = false
      }
    })

    this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
      this.active = false
    })

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      if (this.layout.isHorizontal()) {
        this.active = false
      } else {
        if (this.item.routerLink) {
          this.updateActiveStateFromRoute()
        } else {
          this.active = false
        }
      }
    })
  }

  ngOnInit() {
    if (!this.layout.isHorizontal() && this.item.routerLink) {
      this.updateActiveStateFromRoute()
    }

    this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index)
  }

  updateActiveStateFromRoute() {
    this.active = this.router.isActive(this.item.routerLink[0], this.item.items ? false : true)
    if (this.active) {
      this.eventBus.emit({
        name: 'menuClicked',
        data: { menu: this.item, user: this.authService.identityClaims['sub'] },
      })
    }
  }

  itemClick(event: Event): void {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault()
      return
    }

    // navigate with hover in horizontal mode
    if (this.root) {
      this.layout.menuHoverActive = !this.layout.menuHoverActive
    }

    // notify other items
    this.menuService.onMenuStateChange(this.key)

    // execute command
    if (this.item.command) {
      this.item.command({
        originalEvent: event,
        item: this.item,
      })
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active
    } else {
      // activate item
      this.active = true

      // reset horizontal menu
      if (this.layout.isHorizontal()) {
        this.menuService.reset()
      }

      if (
        this.layout.isMobile() ||
        this.layout.menuMode === 'overlay' ||
        this.layout.menuMode === 'popup'
      ) {
        this.layout.menuActive = false
      }

      this.layout.menuHoverActive = false

      this.eventBus.emit({
        name: 'menuClicked',
        data: { menu: this.item, user: this.authService.identityClaims['sub'] },
      })
    }
  }

  onMouseEnter() {
    // activate item on hover
    if (
      this.root &&
      this.layout.menuHoverActive &&
      this.layout.isHorizontal() &&
      !this.layout.isMobile() &&
      !this.layout.isTablet()
    ) {
      this.menuService.onMenuStateChange(this.key)
      this.active = true
    }
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe()
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe()
    }
  }
}
