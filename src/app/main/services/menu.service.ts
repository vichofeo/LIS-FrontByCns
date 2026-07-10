import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Subject, firstValueFrom, map } from 'rxjs'

import { environment } from '@env/environment'
import { UserClaims } from 'auth'
import { AuthService } from 'auth'

import { ParameterUserRol } from '../models/parameter-user-rol'
import { UserRol } from '../models/user-rol'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menuSource = new Subject<string>()
  resetSource = new Subject()

  menuSource$ = this.menuSource.asObservable()
  resetSource$ = this.resetSource.asObservable()

  readonly url: string
  private authService = inject(AuthService)
  private http = inject(HttpClient)
  constructor() {
    if (environment.production) {
      this.url = `${environment.api}/catalogo/${environment.apiVersion}/`
    } else {
      this.url = `${environment.apiSecurity}/${environment.apiVersion}/`
    }
  }
  getMenu() {
    const usuario: UserClaims = this.authService.identityClaims
    return this.http
      .get<UserRol>(`${this.url}userRoles/userRolesTrees/${usuario.sub}`)
      .pipe(
        map(response => {
          return response
        }),
      )
      .toPromise()
  }

  async getMenuSalud(): Promise<UserRol> {
    const usuario: UserClaims = this.authService.identityClaims
    if (!usuario?.sub) {
      throw new Error('Usuario no autenticado')
    }
    return await firstValueFrom(
      this.http.get<UserRol>(
        `${this.url}userRoles/userRolesTreesDiferenciado/${usuario.sub}/salud`,
      ),
    )
  }

  getPrivilegios() {
    const usuario: UserClaims = this.authService.identityClaims
    return this.http.get<UserRol>(`${this.url}userRoles/userRolesTrees/${usuario.sub}`).pipe(
      map(response => {
        return response
      }),
    )
  }

  getAccess(user: string, menu: number) {
    return this.http.get<ParameterUserRol>(
      `${this.url}parameterUserRoles/users/${user}/rolesResources/${menu}`,
    )
  }

  onMenuStateChange(key: string) {
    this.menuSource.next(key)
  }

  reset() {
    this.resetSource.next(null)
  }
}
