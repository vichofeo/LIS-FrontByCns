import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, map } from 'rxjs'

import { Persona } from '../models/persona'

@Injectable({
  providedIn: 'root',
})
export class RrhhPersonaService {
  readonly url: string
  private http = inject(HttpClient)
  constructor() {
    if (environment.production) {
      this.url = `${environment.api}/erpcns/${environment.apiVersion}/RecursosHumanos`
    } else {
      this.url = `${environment.erpCnsApi}/${environment.apiVersion}/RecursosHumanos`
    }
  }

  getPersona(DocumentoIdentidad: string, FechaNacimiento: string): Observable<Persona> {
    return this.http
      .get<Persona>(
        `${this.url}/Personas?DocumentoIdentidad=${DocumentoIdentidad}&FechaNacimiento=${FechaNacimiento}`,
      )
      .pipe(
        map(response => {
          return response
        }),
      )
  }

  getFotoProfile(imagenId: number): Observable<Blob> {
    return this.http
      .get(`${this.url}/Personas/Imagen?imagenId=${imagenId}`, { responseType: 'blob' })
      .pipe(
        map(response => {
          return response
        }),
      )
  }
}
