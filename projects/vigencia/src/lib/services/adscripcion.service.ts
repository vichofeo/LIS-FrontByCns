import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class AdscripcionService {
  uri: string
  controller = 'Adscripcion'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.vigenciaApi}/${environment.apiVersion}/${this.controller}`
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getByGrupoFamiliarId(grupoFamiliarId: number) {
    return this.http.get(`${this.uri}/grupoFamiliar/${grupoFamiliarId}`)
  }

  getByGrupoIds(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/ByGrupoFamiliarIds`, {
      params: dataQuery as HttpParams,
    })
  }

  getHistorialByGrupoFamiliar(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/historial`, { params: dataQuery as HttpParams })
  }

  getByIdsGrupo(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/idsGrupoFamiliar`, {
      params: dataQuery as HttpParams,
    })
  }

  post(data: any) {
    return this.http.post(`${this.uri}`, data)
  }
}
