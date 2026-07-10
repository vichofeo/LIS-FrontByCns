import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'

import { Ubicacion } from 'shared'

import { RegionalDistrital } from '../../models/regional-distrital'

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  uri: string
  controller = 'Ubicaciones'
  private http = inject(HttpClient)

  constructor() {
    if (environment.production) {
      this.uri = `${environment.api}/erpcns/${environment.apiVersion}/${this.controller}`
    } else {
      this.uri = `${environment.erpCnsApi}/${environment.apiVersion}/${this.controller}`
    }
  }

  getAll(dataQuery: unknown) {
    return this.http.get<RegionalDistrital[]>(`${this.uri}/RegionalesDistritales`, {
      params: dataQuery as HttpParams,
    })
  }

  getById(ubicacionId: number) {
    return this.http.get<Ubicacion[]>(`${this.uri}/${ubicacionId}`)
  }
}
