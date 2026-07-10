import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class KardexService {
  uri: string
  controller = 'Kardex'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getConsultorioMedicos(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/consultorio-medicos`, {
      params: dataQuery as HttpParams,
    })
  }

  getReservasByConsultorio(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byConsultorio`, {
      params: dataQuery as HttpParams,
    })
  }

  getReservasByConsultorioMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byConsultorioMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  getAsegurados(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/search`, {
      params: dataQuery as HttpParams,
    })
  }
}
