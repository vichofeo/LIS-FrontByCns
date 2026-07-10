import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  uri: string
  controller = 'Ubicaciones'
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

  getAll2(data: any) {
    return this.http.get<any[]>(`${this.uri}`, { params: data as HttpParams }).pipe(
      map(response => {
        return response
      }),
    )
  }
}
