import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, map } from 'rxjs'

import { Tarjeta } from '../models/usuario'

@Injectable({
  providedIn: 'root',
})
export class RrhhTarjetaService {
  readonly url: string
  private http = inject(HttpClient)

  constructor() {
    if (environment.production) {
      this.url = `${environment.api}/erpcns/${environment.apiVersion}/RecursosHumanos`
    } else {
      this.url = `${environment.erpCnsApi}/${environment.apiVersion}/RecursosHumanos`
    }
  }

  getTarjeta(
    personaId: number,
    DocumentoIdentidad: string,
    gestion: number,
    mes: number,
  ): Observable<Tarjeta> {
    return this.http
      .get<Tarjeta>(
        `${this.url}/TarjetaAsistencia?personaId=${personaId}&DocumentoIdentidad=${DocumentoIdentidad}&Gestion=${gestion}&Mes=${mes}`,
      )
      .pipe(
        map(response => {
          return response
        }),
      )
  }
}
