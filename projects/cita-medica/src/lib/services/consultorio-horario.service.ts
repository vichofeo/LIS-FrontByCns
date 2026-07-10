import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

import { Usuario } from '../models'

@Injectable({
  providedIn: 'root',
})
export class ConsultorioHorarioService {
  uri: string
  controller = 'ConsultorioHorarios'
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

  getPage(consultorioId: number, dataQuery: any) {
    return this.http.get(`${this.uri}/pages/consultorio/${consultorioId}`, {
      params: dataQuery as HttpParams,
    })
  }

  getByHorario(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byHorario`, {
      params: dataQuery as HttpParams,
    })
  }

  getByFecha(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byFecha`, {
      params: dataQuery as HttpParams,
    })
  }

  getHorarios(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/horarios`, {
      params: dataQuery as HttpParams,
    })
  }

  getHorariosByRange(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/horariosRangeDate`, {
      params: dataQuery as HttpParams,
    })
  }

  getMedicosByConsultorio(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/medicosByConsultorio`, {
      params: dataQuery as HttpParams,
    })
  }

  getEstadoHorarioMedicoByConsultorio(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/estadoHorarioMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  getMedicosByRange(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/medicosRangeDate`, {
      params: dataQuery as HttpParams,
    })
  }

  getByCentroMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byCentroMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  getFormImport(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/forImport`, {
      params: dataQuery as HttpParams,
    })
  }

  getListByMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  getListadoByCentroMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/listado/byCentroMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  getConsultoriosByMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/consultorios`, {
      params: dataQuery as HttpParams,
    })
  }

  getMedicos(dataQuery: any) {
    return this.http.get<Usuario[]>(`${this.uri}/medicos`, {
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
