import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { Observable } from 'rxjs'
import { DynamicResponse } from '../models/dynamic-api.models'

@Injectable({ providedIn: 'root' })
export class DynamicApiService {
  private http = inject(HttpClient)
  private baseUrl = `${environment.lisApi}dinamico`

  get(carpeta: string, modelo: string, params?: Record<string, string>): Observable<DynamicResponse> {
    let httpParams = new HttpParams()
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if(v!= '-1')
        httpParams = httpParams.set(k, v)
      }
    }
    return this.http.get<DynamicResponse>(`${this.baseUrl}/${carpeta}/${modelo}`, { params: httpParams })
  }

  post(carpeta: string, modelo: string, body: unknown): Observable<DynamicResponse> {
    return this.http.post<DynamicResponse>(`${this.baseUrl}/${carpeta}/${modelo}`, body)
  }

  put(carpeta: string, modelo: string, body: unknown): Observable<DynamicResponse> {
    return this.http.put<DynamicResponse>(`${this.baseUrl}/${carpeta}/${modelo}`, body)
  }

  remove(carpeta: string, modelo: string, idx: string): Observable<DynamicResponse> {
    return this.http.delete<DynamicResponse>(`${this.baseUrl}/${carpeta}/${modelo}/${idx}`)
  }
}
