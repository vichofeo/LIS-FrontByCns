import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { UsuarioRequest } from 'auth'

@Injectable({
  providedIn: 'root',
})
export class PersonalService {
  uri: string
  controller = 'Users'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.api}/auth/${environment.apiVersion}/${this.controller}`
  }

  getAll(search: string, autocomplete?: boolean) {
    return this.http.get<UsuarioRequest[]>(
      `${this.uri}/Search?query=${search}${autocomplete ? '&autocomplete=1' : ''}`,
    )
  }
}
