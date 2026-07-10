import { HttpClient } from '@angular/common/http'
import { Component, OnInit, inject, signal } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { PrimeNG } from 'primeng/config'
import { ToastModule } from 'primeng/toast'
import { Observable } from 'rxjs'

import { AuthService } from 'auth'

import { EventBusService } from './main/services/event-bus.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  isAuthenticated: Observable<boolean>
  isDoneLoading: Observable<boolean>
  canActivateProtectedRoutes: Observable<boolean>
  theme = ''
  public eventBus = inject(EventBusService)
  protected readonly title = signal('pgr-salud-last')
  private authService = inject(AuthService)
  private router = inject(Router)
  private http = inject(HttpClient)
  private config = inject(PrimeNG)
  constructor() {
    this.isAuthenticated = this.authService.isAuthenticated$
    this.isDoneLoading = this.authService.isDoneLoading$
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$
    this.getStyles()
  }

  get hasValidToken() {
    return this.authService.hasValidToken()
  }

  get accessToken() {
    return this.authService.accessToken
  }

  get refreshToken() {
    return this.authService.refreshToken
  }

  get identityClaims() {
    return this.authService.identityClaims
  }

  get idToken() {
    return this.authService.idToken
  }

  ngOnInit(): void {
    this.ConfigIdioma()
    this.authService.runInitialLoginSequence()
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return
      }
      window.scrollTo(0, 0)
    })
  }

  async getStyles() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await this.http.get('assets/config-theme.json').toPromise()
    const root = document.documentElement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataCss: any = data?.default
    switch (data?.theme) {
      case 'pgrsalud_orange':
        dataCss = data?.pgrsalud_orange
        break
      case 'pgrsalud_orange_dark':
        dataCss = data?.pgrsalud_orange_dark
        break
      case 'pgrsalud_blue_dark':
        dataCss = data?.pgrsalud_blue_dark
        break
      case 'staging':
        dataCss = data?.staging
        break
      case 'develop':
        dataCss = data?.develop
        break
      default:
        dataCss = data?.default
    }

    if (dataCss) {
      root.style.setProperty('--background-color', dataCss['background-color'])
      root.style.setProperty('--color-menu', dataCss['color-menu'])
      root.style.setProperty('--color-menu-inactive', dataCss['color-menu-inactive'])
      root.style.setProperty('--color-menu-inactive-hover', dataCss['color-menu-inactive-hover'])
      root.style.setProperty('--primary-color', dataCss['primary-color'])
      root.style.setProperty('--color-background-header', dataCss['color-background-header'])
      root.style.setProperty('--text-color', dataCss['text-color'])
      root.style.setProperty('--text-color-secondary', dataCss['text-color-secondary'])
      root.style.setProperty('--background-icon', dataCss['background-icon'])
    }
  }

  login() {
    this.authService.login()
  }
  logout() {
    this.authService.logout()
  }
  refresh() {
    this.authService.refresh()
  }
  reload() {
    window.location.reload()
  }
  clearStorage() {
    localStorage.clear()
  }

  logoutExternally() {
    window.open(this.authService.logoutUrl)
  }

  ConfigIdioma() {
    this.config.setTranslation({
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      monthNamesShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
    })
  }
}
