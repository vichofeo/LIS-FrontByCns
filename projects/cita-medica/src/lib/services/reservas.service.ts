import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  uri: string
  controller = 'Reservas'
  private http = inject(HttpClient)

  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getAll(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}`, { params: dataQuery as HttpParams })
  }

  getPage(dataQuery: any) {
    return this.http.get(`${this.uri}/pages`, { params: dataQuery as HttpParams })
  }

  getPageByConsultorioHorario(dataQuery: any) {
    return this.http.get(`${this.uri}/pages/byConsultorioHorario`, {
      params: dataQuery as HttpParams,
    })
  }

  getByRangoFechas(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byFechaRange`, { params: dataQuery as HttpParams })
  }

  getReservasByAsegurado(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byAsegurado`, { params: dataQuery as HttpParams })
  }

  getReservasByCentroMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byCentroMedico`, { params: dataQuery as HttpParams })
  }
  getReservasByCentroMedicoList(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byCentroMedicoList`, {
      params: dataQuery as HttpParams,
    })
  }

  getListReservasByCentroMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byCentroMedico/list`, {
      params: dataQuery as HttpParams,
    })
  }

  getByConsultorioHorario(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byConsultorioHorario`, {
      params: dataQuery as HttpParams,
    })
  }

  getByMedicoConsultorio(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byMedicoConsultorio`, {
      params: dataQuery as HttpParams,
    })
  }

  getReservasByAseguradoFecha(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byAseguradoFecha`, { params: dataQuery as HttpParams })
  }

  getReservasByNoAseguradoFecha(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byNoAseguradoFecha`, {
      params: dataQuery as HttpParams,
    })
  }

  getPageByMedico(dataQuery: any) {
    return this.http.get(`${this.uri}/pages/ByMedico`, { params: dataQuery as HttpParams })
  }

  getUserCreation(dataQuery: unknown) {
    return this.http.get(`${this.uri}/userReserva`, { params: dataQuery as HttpParams })
  }

  getReservasByReferencia(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byReferencia`, { params: dataQuery as HttpParams })
  }

  getByConsultorioMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/byConsultorioMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  post(data: any) {
    return this.http.post(`${this.uri}`, data)
  }

  postReconsulta(data: any) {
    return this.http.post(`${this.uri}/reconsulta`, data)
  }

  postTraspaso(data: any) {
    return this.http.post(`${this.uri}/traspaso`, data)
  }

  postMigration(data: any) {
    return this.http.post(`${this.uri}/migration`, data)
  }

  postReprogramacion(data: any) {
    return this.http.post(`${this.uri}/reprogramacion`, data)
  }

  put(id: string, data: any) {
    return this.http.put(`${this.uri}/${id}`, data)
  }

  delete(id: string) {
    return this.http.delete(`${this.uri}/${id}`)
  }

  putEstado(id: string, data: any) {
    return this.http.put(`${this.uri}/estado/${id}`, data)
  }

  putEstadoObservacion(data: any) {
    return this.http.put(`${this.uri}/estado-observacion`, data)
  }
}
