import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class HorasService {
  uri: string
  controller = 'horas'
  private http = inject(HttpClient)

  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getPage(horarioId: number, dataQuery: any) {
    return this.http.get(`${this.uri}/page/horario/${horarioId}`, {
      params: dataQuery as HttpParams,
    })
  }

  getAllByConsultorio(consultorioId: number, dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/consultorio/${consultorioId}`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map(response => {
          return response.map(x => {
            return {
              ...x,
              horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
            }
          })
        }),
      )
      .toPromise()
  }

  getByConsultorioHorario(consultorioHorarioId: number, dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/byConsultorioHorario/${consultorioHorarioId}`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map(response => {
          return response.map(x => {
            return {
              ...x,
              horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
            }
          })
        }),
      )
      .toPromise()
  }

  getAllByConsultorioHorario(consultorioHorarioId: number, dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/allByConsultorioHorario/${consultorioHorarioId}`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map(response => {
          return response.map(x => {
            return {
              ...x,
              horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
            }
          })
        }),
      )
      .toPromise()
  }

  getByConsultorio(consultorioId: number, medicoUsuarioId: string, dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/horasByConsultorio/${consultorioId}/${medicoUsuarioId}`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map(response =>
          response.map(x => ({
            ...x,
            horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
          })),
        ),
      )
  }

  getByConsultorioRehabilitacion(
    consultorioId: number,
    medicoUsuarioId: string,
    dataQuery: any = null,
  ) {
    return this.http
      .get<any[]>(
        `${this.uri}/horasByConsultorioRehabilitacion/${consultorioId}/${medicoUsuarioId}`,
        {
          params: dataQuery as HttpParams,
        },
      )
      .pipe(
        map(response =>
          response.map(x => ({
            ...x,
            horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
          })),
        ),
      )
  }

  getHorasForReconsultas(consultorioHorarioId: number, dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/forReconsultas/${consultorioHorarioId}`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map(response => {
          return response.map(x => {
            return {
              ...x,
              horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
            }
          })
        }),
      )
      .toPromise()
  }

  getHorasReconsultasAtencion(consultorioHorarioId: number, dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/reconsultasAtencion/${consultorioHorarioId}`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map(response => {
          return response.map(x => {
            return {
              ...x,
              horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
            }
          })
        }),
      )
      .toPromise()
  }

  getHorasProgramacion(dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/forProgramacion`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map(response => {
          return response.map(x => {
            return {
              ...x,
              horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
            }
          })
        }),
      )
      .toPromise()
  }

  getHorasTraspaso(dataQuery: any = null) {
    return this.http
      .get<any[]>(`${this.uri}/forTraspaso`, {
        params: dataQuery as HttpParams,
      })
      .pipe(
        map(response => {
          return response.map(x => {
            return {
              ...x,
              horaDisponible: x.inicioDetalle + ' - ' + x.finDetalle,
            }
          })
        }),
      )
      .toPromise()
  }

  getHorasRehabilitacion(dataQuery: any) {
    return this.http.get(`${this.uri}/horas-rehabilitacion`, {
      params: dataQuery as HttpParams,
    })
  }

  getHorasRehabilitacionDate(dataQuery: any) {
    return this.http.get(`${this.uri}/rehabilitacion-date`, {
      params: dataQuery as HttpParams,
    })
  }

  post(data: any) {
    return this.http.post(`${this.uri}`, data)
  }

  postByHorario(data: any) {
    return this.http.post(`${this.uri}/byHorario`, data)
  }

  put(id: string, data: any) {
    return this.http.put(`${this.uri}/${id}`, data)
  }
}
