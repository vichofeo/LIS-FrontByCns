import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class ParametricasService {
  uri: string
  controller = 'Parametricas'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getEstadosReserva(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/estadoReserva`, {
      params: dataQuery as HttpParams,
    })
  }

  getTipoConsultorio(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/tipoConsultorio`, {
      params: dataQuery as HttpParams,
    })
  }
}
