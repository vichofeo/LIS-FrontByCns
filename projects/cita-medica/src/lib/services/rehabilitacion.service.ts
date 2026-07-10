import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class RehabilitacionService {
  uri: string
  controller = 'Rehabilitacion'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getReservas(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/reservas`, { params: dataQuery as HttpParams })
  }

  getDetail(dataQuery: any) {
    return this.http.get(`${this.uri}/detail`, { params: dataQuery as HttpParams })
  }

  getReservasMedicoDate(dataQuery: any) {
    return this.http.get(`${this.uri}/reservas-date-medico`, { params: dataQuery as HttpParams })
  }

  searchReservas(dataQuery: any) {
    return this.http.get(`${this.uri}/search-reservas`, { params: dataQuery as HttpParams })
  }

  postRehabilitacion(data: any) {
    const headers = { 'X-Skip-Error-Handling': 'true' }
    return this.http.post(`${this.uri}`, data, { headers })
  }

  postReprogramacionSesiones(data: any) {
    return this.http.post(`${this.uri}/reprogramacion-sesion?autocomplete=1`, data)
  }

  postReprogramacionSesionesWithCustomErrorHandling(data: any) {
    const headers = { 'X-Skip-Error-Handling': 'true' }
    return this.http.post(`${this.uri}/reprogramacion-sesion?autocomplete=1`, data, { headers })
  }

  deleteReservas(ids: number[]) {
    let params = new HttpParams()
    ids.forEach(id => {
      params = params.append('ids', id.toString())
    })
    return this.http.delete(`${this.uri}/reservas`, { params })
  }

  putEstado(data: any) {
    return this.http.put(`${this.uri}/estado`, data)
  }
}
