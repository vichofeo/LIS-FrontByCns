import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  uri: string
  controller = 'Horarios'
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

  getCalculoFichas(dataQuery: any) {
    return this.http.get(`${this.uri}/calculo/fichas`, { params: dataQuery as HttpParams })
  }

  getVerificarCalendario(dataQuery: any) {
    return this.http.get(`${this.uri}/verificar-calendario`, { params: dataQuery as HttpParams })
  }

  post(data: any) {
    return this.http.post(`${this.uri}`, data)
  }

  postSimple(data: any) {
    return this.http.post(`${this.uri}/simple`, data)
  }

  put(id: string, data: any) {
    return this.http.put(`${this.uri}/${id}`, data)
  }

  delete(id: string) {
    return this.http.delete(`${this.uri}/${id}`)
  }
}
