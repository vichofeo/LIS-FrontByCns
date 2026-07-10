import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class AporteAseguradoService {
  uri: string
  controller = 'AporteAsegurados'
  private http = inject(HttpClient)

  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  postAporteAsegurado(data: any) {
    return this.http.post(`${this.uri}?autocomplete=1`, data)
  }
}
