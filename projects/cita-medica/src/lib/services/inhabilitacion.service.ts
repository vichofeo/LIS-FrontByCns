import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

import { Medico, Usuario } from '../models'
import { DataResponse, Inhabilitacion } from '../models/Inhabilitacion'

@Injectable({
  providedIn: 'root',
})
export class InhabilitacionService {
  uri: string
  controller = 'Inhabilitaciones'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getAll(dataQuery: unknown) {
    return this.http.get<unknown[]>(`${this.uri}`, { params: dataQuery as HttpParams })
  }

  getPage(consultorioId: number, dataQuery: unknown) {
    return this.http.get<DataResponse>(`${this.uri}/pages/consultorio/${consultorioId}`, {
      params: dataQuery as HttpParams,
    })
  }

  getPageRegional(dataQuery: unknown) {
    return this.http.get<DataResponse>(`${this.uri}/pages/regional`, {
      params: dataQuery as HttpParams,
    })
  }

  getMedicos(dataQuery: unknown) {
    return this.http.get<Usuario[]>(`${this.uri}/medicos`, { params: dataQuery as HttpParams })
  }

  getMedicosDetalle(dataQuery: unknown) {
    return this.http.get<Usuario[]>(`${this.uri}/medicosDetalle`, {
      params: dataQuery as HttpParams,
    })
  }

  getInhabilitacionesMedico(dataQuery: unknown) {
    return this.http.get<Inhabilitacion[]>(`${this.uri}/inhabilitacion-medico`, {
      params: dataQuery as HttpParams,
    })
  }

  getReservasMedico(dataQuery: unknown) {
    return this.http.get<Medico[]>(`${this.uri}/reservas-medico`, {
      params: dataQuery as HttpParams,
    })
  }

  getInhabilitacionesRehabilitacion(dataQuery: unknown) {
    return this.http.get<Inhabilitacion[]>(`${this.uri}/inhabilitacion-rehabilitacion`, {
      params: dataQuery as HttpParams,
    })
  }

  post(data: unknown) {
    return this.http.post(`${this.uri}`, data)
  }

  put(id: string, data: unknown) {
    return this.http.put(`${this.uri}/${id}`, data)
  }

  delete(id: string) {
    return this.http.delete(`${this.uri}/${id}`)
  }

  postAll(data: unknown) {
    return this.http.post(`${this.uri}/all`, data)
  }

  putAll(id: string, data: unknown) {
    return this.http.put(`${this.uri}/all/${id}`, data)
  }
}
