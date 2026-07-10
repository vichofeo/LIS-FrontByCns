import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class ConsultorioUsuarioService {
  uri: string
  controller = 'ConsultorioUsuarios'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getByUser() {
    return this.http.get(`${this.uri}/byUser`)
  }

  getPage(dataQuery: unknown) {
    return this.http.get(`${this.uri}/pages`, { params: dataQuery as HttpParams })
  }

  post(data: unknown) {
    return this.http.post(`${this.uri}`, data)
  }

  delete(id: number) {
    return this.http.delete(`${this.uri}/${id}`)
  }
}
