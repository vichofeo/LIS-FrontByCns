import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class PrestamoDetalleService {
  uri: string
  controller = 'PrestamoDetalle'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getById(id: number) {
    return this.http.get(`${this.uri}/${id}`)
  }

  getPage(dataQuery: any) {
    return this.http.get(`${this.uri}/pages`, {
      params: dataQuery as HttpParams,
    })
  }

  post(data: any) {
    return this.http.post(`${this.uri}`, data)
  }

  put(data: any) {
    return this.http.put(`${this.uri}`, data)
  }

  putDevolucion(data: any) {
    return this.http.put(`${this.uri}/devolucion`, data)
  }

  putDevolucionAsegurados(data: any) {
    return this.http.put(`${this.uri}/asegurados`, data)
  }

  delete(id: string) {
    return this.http.delete(`${this.uri}/${id}`)
  }
}
