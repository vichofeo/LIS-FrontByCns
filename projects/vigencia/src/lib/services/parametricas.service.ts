import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class ParametricasService {
  uri: string
  controller = 'Parametricas'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.vigenciaApi}/${environment.apiVersion}/${this.controller}`
  }

  getTipoCentroMedico(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/tipoCentroMedico`, {
      params: dataQuery as HttpParams,
    })
  }

  getTipoConsultorio(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/tipoConsultorio`, {
      params: dataQuery as HttpParams,
    })
  }

  getTipoEspecialidad(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/tipoEspecialidad`, {
      params: dataQuery as HttpParams,
    })
  }
}
