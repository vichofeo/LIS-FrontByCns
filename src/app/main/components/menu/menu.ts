import { CommonModule } from '@angular/common'
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MenuItem } from 'primeng/api'

import { environment } from '@env/environment'
import { MenuResponse } from '@main/models/menu'

import { Layout } from '../../pages/layout/layout'
import { EventBusService } from '../../services/event-bus.service'
import { MenuService } from '../../services/menu.service'
import { Menuitem } from '../menuitem/menuitem'

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, Menuitem],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  model: MenuItem[] = []
  modelBackup: MenuItem[] = []
  modelSearch: MenuItem[] = []
  buscar = ''

  public layout = inject(Layout)
  public eventBus = inject(EventBusService)

  private cdr = inject(ChangeDetectorRef)
  private menuService = inject(MenuService)

  ngOnInit() {
    this.model = environment.staticMenu
      ? [{ label: 'Inicio', routerLink: ['/admin'] }]
      : [{ label: 'Inicio', routerLink: ['/admin'] }]
    this.getMenu()
  }

  changeTheme(theme: string) {
    const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement
    const href = 'assets/theme/theme-' + theme + '.css'

    this.replaceLink(themeLink, href)
  }

  changeLayout(layout: string) {
    const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement
    const href = 'assets/layout/css/layout-' + layout + '.css'

    this.replaceLink(layoutLink, href)
  }

  isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
  }

  replaceLink(linkElement: HTMLLinkElement, href: string): void {
    if (this.isIE()) {
      linkElement.setAttribute('href', href)
    } else {
      const id = linkElement.getAttribute('id')
      const cloneLinkElement = linkElement.cloneNode(true) as HTMLLinkElement
      cloneLinkElement.setAttribute('href', href)

      if (id) {
        cloneLinkElement.setAttribute('id', `${id}-clone`)
      }

      linkElement.parentNode?.insertBefore(cloneLinkElement, linkElement.nextSibling)

      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove()

        if (id) {
          cloneLinkElement.setAttribute('id', id)
        }
      })
    }
  }

  async getMenu() {
    if (!environment.staticMenu) {
      const responseMenu = await this.menuService.getMenuSalud()
      const menu: MenuResponse[] = JSON.parse(responseMenu.recurso)
      const data = this.getItems(menu)
      this.model = [...this.model, ...data]
    }
    this.modelBackup = [...this.model]
    this.cdr.detectChanges()
  }

  getItems(item: MenuResponse[]) {
    let x = {}
    const response = []
    for (const i of item) {
      if (i.children.length > 0) {
        x = {
          id: i.key,
          label: i.label,
          routerLink: [i.data],
          items: this.getItems(i.children),
          rolRecursoId: i.rolRecursoId,
        }
      } else {
        x = {
          id: i.key,
          label: i.label,
          routerLink: [i.data],
          rolRecursoId: i.rolRecursoId,
        }
      }
      response.push(x)
    }
    return response
  }

  onMenuClick() {
    this.layout.onMenuClick()
  }

  onKey() {
    this.model = this.modelBackup
    this.modelSearch = []
    if (this.buscar != '') {
      this.findMenu(this.model)
      this.model = this.modelSearch
    }
  }

  findMenu(model: MenuItem[]): void {
    model.map((node: MenuItem) => {
      if (node.items) {
        this.findMenu(node.items)
      } else {
        if (node.label?.toLowerCase().includes(this.buscar.toLowerCase())) {
          this.modelSearch.push(node)
        }
      }
      return node
    })
  }
}
