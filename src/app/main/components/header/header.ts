import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, ElementRef, OnInit, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc'
import { filter, firstValueFrom, forkJoin, map, startWith } from 'rxjs'

import { environment } from '@env/environment'
import { VersionesService } from '@main/services/versiones.service'
import { UserClaims } from 'auth'

import { ThemeConfig } from '../../models/theme-config'
import { Layout } from '../../pages/layout/layout'
import { Menu } from '../menu/menu'

@Component({
  selector: 'app-header',
  imports: [CommonModule, Menu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  totalNotifications = '25'
  regional = ''
  user = signal<UserClaims | null>(null)

  public layout = inject(Layout)
  private oauthService = inject(OAuthService)
  private http = inject(HttpClient)
  private elementRef = inject(ElementRef)
  private router = inject(Router)
  private versionService = inject(VersionesService)

  constructor() {
    this.getLogo()
  }

  ngOnInit() {
    this.getUser()
  }

  getUser(): void {
    this.oauthService.events
      .pipe(
        filter((e: OAuthEvent) =>
          [
            'token_received',
            'token_refreshed',
            'user_profile_loaded',
            'discovery_document_loaded',
          ].includes(e.type),
        ),
        map(() => this.oauthService.getIdentityClaims() as UserClaims | null),
        startWith(this.oauthService.getIdentityClaims() as UserClaims | null),
      )
      .subscribe(claims => {
        this.user.set(claims)
      })
  }

  async getLogo() {
    const data = await firstValueFrom(this.http.get<ThemeConfig>('assets/config-theme.json'))

    this.regional = data ? data.regional : ''
    if (data?.theme == 'nacional') {
      const imgElement = this.elementRef.nativeElement.querySelector('#logo-pgr')
      imgElement.src = `assets/layout/images/logo-pgr_nacional.png`
    }
  }

  onManualButtonClick(event: Event) {
    this.layout.configManualActive = !this.layout.configManualActive
    this.layout.manualClick = true
    event.preventDefault()
  }

  setting(event: Event) {
    window.open(`${environment.issuer}/Identity/Account/Manage`, '_blank')
    event.preventDefault()
  }

  getPerfil(): void {
    this.router.navigate(['/admin/usuario/perfil'])
  }

  onVersionesButtonClick() {
    forkJoin({
      citasMedicas: this.versionService.citasMedicas(),
      vigencia: this.versionService.vigenciaDerecho(),
    }).subscribe({
      next: (resp) => {
        this.versionService.setVersiones({
          citasMedicas: {
            version: resp.citasMedicas.version,
            buildDate: resp.citasMedicas.buildDate,
          },
          vigencia: {
            version: resp.vigencia.version,
            buildDate: resp.vigencia.buildDate,
          },
        });
      },
    });
    this.layout.configActualizaciones = !this.layout.configActualizaciones;
    this.layout.actualizacionClick = true;
  }

}
