import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { map } from 'rxjs'

import { Usuario } from 'usuario'

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  readonly url: string
  readonly rootURL = 'entities'
  private http = inject(HttpClient)

  constructor() {
    if (environment.production) {
      this.url = `${environment.api}/usuario/${environment.apiVersion}/`
    } else {
      this.url = `${environment.apiSecurity}/${environment.apiVersion}/`
    }
  }

  getAll(page: number, pageSize: number) {
    return this.http
      .get<Usuario>(`${this.url}${this.rootURL}?page=${page}&pageSize=${pageSize}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }
}
