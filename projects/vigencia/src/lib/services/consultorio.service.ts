import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

import { Consultorio } from 'vigencia'

@Injectable({
  providedIn: 'root',
})
export class ConsultorioService {
  uri: string
  controller = 'Consultorios'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.vigenciaApi}/${environment.apiVersion}/${this.controller}`
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getAll(dataQuery: unknown) {
    return this.http.get<Consultorio[]>(`${this.uri}`, {
      params: dataQuery as HttpParams,
    })
  }

  getAllConsultorios(dataQuery: unknown) {
    return this.http.get<Consultorio[]>(`${this.uri}/all`, {
      params: dataQuery as HttpParams,
    })
  }

  getByCentroMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byCentroMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  getPage(dataQuery: any) {
    return this.http.get(`${this.uri}/pages`, {
      params: dataQuery as HttpParams,
    })
  }

  getByIds(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/getByIds`, {
      params: dataQuery as HttpParams,
    })
  }

  getAdscripcion(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/adscripcion`, {
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
