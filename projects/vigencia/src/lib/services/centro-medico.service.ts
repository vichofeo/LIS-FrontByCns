import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

import { CentroMedico } from 'vigencia'

@Injectable({
  providedIn: 'root',
})
export class CentroMedicoService {
  uri: string
  controller = 'CentrosMedicos'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.vigenciaApi}/${environment.apiVersion}/${this.controller}`
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getAll(dataQuery: unknown) {
    return this.http.get<CentroMedico[]>(`${this.uri}`, {
      params: dataQuery as HttpParams,
    })
  }

  getAllCentros() {
    return this.http.get<CentroMedico[]>(`${this.uri}/all`)
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

  putUbicacion(id: string, data: any) {
    return this.http.put(`${this.uri}/update/localizacion/${id}`, data)
  }
}
