import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, map } from 'rxjs'
import { PageResponse, Parametro } from 'shared'

import { Empleado } from '../models/empleado'
import { ResumenBoletas } from '../models/resumen-boletas'
import { DatosEmpleo, Gestion } from '../models/usuario'
@Injectable({
  providedIn: 'root',
})
export class RrhhEmpledoService {
  readonly url: string
  private http = inject(HttpClient)
  constructor() {
    if (environment.production) {
      this.url = `${environment.api}/erpcns/${environment.apiVersion}/RecursosHumanos`
    } else {
      this.url = `${environment.erpCnsApi}/${environment.apiVersion}/RecursosHumanos`
    }
  }

  getDatosEmpleo(id: number): Observable<DatosEmpleo> {
    return this.http.get<DatosEmpleo>(`${this.url}/Empleados?Id=${id}`).pipe(
      map(response => {
        return response
      }),
    )
  }

  getResumenBoleta(matricula: string, gestion: number): Observable<ResumenBoletas[]> {
    return this.http
      .get<ResumenBoletas[]>(`${this.url}/Empleados/ResumenBoletas?matricula=${matricula}&gestion=${gestion}`)
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getEmpleadosByMesGestion(
    Search: string,
    PageNumber: number,
    PageSize: number,
    RegionalId: string,
    Mes: number,
    Gestion: number,
    Tipo: number,
    Datos: string,
    Estado: number,
    CobroPor: number,
  ) {
    const query = `?PageNumber=${PageNumber}&PageSize=${PageSize}`
    const querySearch = Search.length > 0 ? `&Search=${Search}` : ''
    const queryRegionalId = RegionalId.length > 0 ? `&RegionalId=${RegionalId}` : ''
    const queryMes = Mes > 0 ? `&Mes=${Mes}` : ''
    const queryGestion = Gestion > 0 ? `&Gestion=${Gestion}` : ''
    const queryTipo = Tipo > 0 ? `&Tipo=${Tipo}` : ''
    const queryDatos = Datos.length > 0 ? `&Datos=${Datos}` : ''
    const queryEstado = `&Estado=${Estado}`
    const queryCobroPor = CobroPor > 0 ? `&CobroPor=${CobroPor}` : ''
    return this.http
      .get<PageResponse<Empleado>>(
        `${this.url}/Empleados/CollectionEmpleados${query}${querySearch}${queryRegionalId}${queryMes}${queryGestion}${queryTipo}${queryDatos}${queryEstado}${queryCobroPor}`,
      )
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getEmpleadosByRangoFechas(
    Search: string,
    PageNumber: number,
    PageSize: number,
    RegionalId: string,
    fechaInicio: string,
    fechaHasta: string,
    Tipo: number,
    Datos: string,
    CobroPor: number,
  ) {
    const query = `?PageNumber=${PageNumber}&PageSize=${PageSize}`
    const querySearch = Search.length > 0 ? `&Search=${Search}` : ''
    const queryRegionalId = RegionalId.length > 0 ? `&RegionalId=${RegionalId}` : ''
    const queryFechaInicio = `&FechaInicio=${fechaInicio}`
    const queryFechaFin = `&FechaFin=${fechaHasta}`
    const queryTipo = Tipo > 0 ? `&Tipo=${Tipo}` : ''
    const queryDatos = Datos.length > 0 ? `&Datos=${Datos}` : ''
    const queryCobroPor = CobroPor > 0 ? `&CobroPor=${CobroPor}` : ''
    return this.http
      .get<PageResponse<Empleado>>(
        `${this.url}/Empleados/CollectionEmpleadosPorRangoFechas${query}${querySearch}${queryRegionalId}${queryFechaInicio}${queryFechaFin}${queryTipo}${queryDatos}${queryCobroPor}`,
      )
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getGestionesBoletas() {
    return this.http.get<Gestion[]>(`${this.url}/Empleados/Gestiones`).pipe(
      map(response => {
        return response.map((resp) => {
          return { ...resp, gestion: resp }
        })
      }),
    )
  }

  getGestionesByMat(matricula: string) {
    return this.http.get<Gestion[]>(`${this.url}/Empleados/Gestiones/${matricula}`).pipe(
      map(response => {
        return response.map((resp) => {
          return { ...resp, gestion: resp }
        })
      }),
    )
  }

  getParametroList(parametroId: number) {
    return this.http.get<Parametro[]>(`${this.url}/Empleados/Parametros?ParametroId=${parametroId}`).pipe(
      map(response => {
        return response
      }),
    )
  }
}
