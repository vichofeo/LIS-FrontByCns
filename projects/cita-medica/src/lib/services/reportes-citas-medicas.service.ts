import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

@Injectable({
  providedIn: 'root',
})
export class ReportesCitasMedicasService {
  uri: string
  controller = 'Reportes'
  private http = inject(HttpClient)
  constructor() {
    this.uri = `${environment.citaMedicaApi}/${environment.apiVersion}/${this.controller}`
  }

  getSeguimientoMedico(dataQuery: any) {
    return this.http.get(`${this.uri}/seguimientoMedico/page`, {
      params: dataQuery as HttpParams,
    })
  }

  getReservasDelete(dataQuery: any) {
    return this.http.get<any[]>(`${this.uri}/deleteReservas`, { params: dataQuery as HttpParams })
  }
}
