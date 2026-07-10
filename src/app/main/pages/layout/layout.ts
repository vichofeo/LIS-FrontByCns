import { CommonModule } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { environment } from '@env/environment'
import { VersionesState } from '@main/models/version'
import { VersionesService } from '@main/services/versiones.service'
import { AuthService } from 'auth'

import { Header } from '../../components/header/header'
import { MenuService } from '../../services/menu.service'

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CommonModule, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  public menuMode = 'static'
  public menuActive = true
  public topbarMenuActive = false
  activeTopbarItem: Element | null = null
  menuClick!: boolean
  menuButtonClick!: boolean
  topbarMenuButtonClick!: boolean
  menuHoverActive!: boolean
  configActive!: boolean
  configManualActive!: boolean
  configClick!: boolean
  manualClick!: boolean
  totalNotifications!: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifications!: any[]
  configActualizaciones = false;
  actualizacionClick = false;
  version = environment.version;
  deployDate = environment.deployDate;

  versiones = signal<VersionesState>({});
  private authService = inject(AuthService)
  private menuService = inject(MenuService)
  private versionService = inject(VersionesService)

  ngOnInit() {
    this.versionService.versiones$.subscribe((versiones) => {
      this.versiones.set(versiones);
    });
  }

  onMenuButtonClick(event: Event) {
    this.menuButtonClick = true
    this.menuActive = !this.menuActive
    event.preventDefault()
  }

  onTopbarMenuButtonClick(event: Event) {
    this.topbarMenuButtonClick = true
    this.topbarMenuActive = !this.topbarMenuActive
    event.preventDefault()
  }

  onTopbarItemClick(event: Event, item: Element) {
    this.topbarMenuButtonClick = true

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null
    } else {
      this.activeTopbarItem = item
    }
    event.preventDefault()
  }

  onTopbarSubItemClick(event: { preventDefault: () => void }) {
    event.preventDefault()
  }

  onLayoutClick() {
    if (!this.menuButtonClick && !this.menuClick) {
      if (this.menuMode === 'horizontal') {
        this.menuService.reset()
      }

      if (this.isMobile() || this.menuMode === 'overlay' || this.menuMode === 'popup') {
        this.menuActive = false
      }

      this.menuHoverActive = false
    }

    if (!this.topbarMenuButtonClick) {
      this.activeTopbarItem = null
      this.topbarMenuActive = false
    }

    if (this.configActive && !this.configClick) {
      this.configActive = false
    }

    if (this.configManualActive && !this.manualClick) {
      this.configManualActive = false
    }

    if (this.configActualizaciones && !this.actualizacionClick) {
      this.configActualizaciones = false;
    }

    this.configClick = false
    this.manualClick = false
    this.actualizacionClick = false;
    this.menuButtonClick = false
    this.menuClick = false
    this.topbarMenuButtonClick = false
  }

  onMenuClick() {
    this.menuClick = true
  }

  isMobile() {
    return window.innerWidth < 1025
  }

  isHorizontal() {
    return this.menuMode === 'horizontal'
  }

  isTablet() {
    const width = window.innerWidth
    return width <= 1024 && width > 640
  }

  logout() {
    this.authService.logout()
    return false
  }

  onConfigClick() {
    this.configClick = true
  }

  onManualClick() {
    this.manualClick = true
  }

  onActualizacionesClick() {
    this.actualizacionClick = true;
  }
}
