import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class ReservasExtrasService {
  uri: string
  controller = 'ReservasExtras'
  private http = inject(HttpClient)

  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getAll(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}`, {
      params: dataQuery as HttpParams,
    })
  }

  getPage(dataQuery: any) {
    return this.http.get(`${this.uri}/pages`, {
      params: dataQuery as HttpParams,
    })
  }

  getByConsultorio(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byConsultorio`, {
      params: dataQuery as HttpParams,
    })
  }

  getByConsultorioHorario(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byConsultorioHorario`, {
      params: dataQuery as HttpParams,
    })
  }

  getFichasExtras(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/fichasExtras`, {
      params: dataQuery as HttpParams,
    })
  }

  getFichasExtrasRehabilitacion(dataQuery: unknown) {
    return this.http.get<any[]>(`${this.uri}/fichasExtrasRehabilitacion`, {
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
