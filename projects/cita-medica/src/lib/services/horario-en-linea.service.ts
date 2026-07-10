/* SERVICE HORARIO-EN-LINEA
========================================== */
import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class HorarioEnLineaService {
  uri: string
  controller = 'HorarioEnLinea'
  private http = inject(HttpClient)

  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getPage(dataQuery: any) {
    return this.http.get(`${this.uri}/pages`, {
      params: dataQuery as HttpParams,
    })
  }

  post(data: any) {
    return this.http.post(`${this.uri}`, data)
  }

  put(id: string, data: any) {
    return this.http.put(`${this.uri}/${id}`, data)
  }

  delete(id: string) {
    return this.http.delete(`${this.uri}/${id}`)
  }
}
