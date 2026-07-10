import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class ConsultorioMedicoService {
  uri: string
  controller = 'ConsultorioMedicos'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getByConsultorioId(consultorioId: number) {
    return this.http.get(`${this.uri}/consultorio/${consultorioId}`)
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
