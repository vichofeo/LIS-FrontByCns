import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class AseguradoService {
  uri: string
  controller = 'Asegurados'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.vigenciaApi}/${environment.apiVersion}/${this.controller}`
  }

  postConsultorio(data: any) {
    return this.http.post(`${this.uri}/ConsultorioUpdate`, data)
  }

  postReferencias(data: any) {
    return this.http.post(`${this.uri}/DatosUpdate`, data)
  }
}
