import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { Observable } from 'rxjs'
import { DynamicAgrupadoResponse, DynamicResponse } from '../models/dynamic-api.models'

@Injectable({ providedIn: 'root' })
export class DynamicApiService {
  private http = inject(HttpClient)
  private baseUrl = `${environment.lisApi}dinamico`

  get(dominio: string, modelo: string, params?: Record<string, string>): Observable<DynamicResponse> {
    let httpParams = new HttpParams()
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v != '-1') httpParams = httpParams.set(k, v)
      }
    }
    return this.http.get<DynamicResponse>(`${this.baseUrl}/${dominio}/${modelo}`, { params: httpParams })
  }

  save(dominio: string, modelo: string, body: unknown): Observable<DynamicResponse> {
    return this.http.post<DynamicResponse>(`${this.baseUrl}/${dominio}/${modelo}/save`, body)
  }

  cbox(dominio: string, modelo: string, selectedValues: Record<string, unknown>): Observable<DynamicResponse> {
    return this.http.post<DynamicResponse>(`${this.baseUrl}/${dominio}/${modelo}/cbox`, selectedValues)
  }

  agrupado(dominio: string, modelo: string): Observable<DynamicAgrupadoResponse> {
    return this.http.post<DynamicAgrupadoResponse>(`${this.baseUrl}/${dominio}/${modelo}/agrupado`, { modelo })
  }
}
