import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { map } from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class RrhhMarcacionesService {
  readonly url: string
  private http = inject(HttpClient)
  constructor() {
    if (environment.production) {
      this.url = `${environment.api}/erpcns/${environment.apiVersion}/RecursosHumanos`
    } else {
      this.url = `${environment.erpCnsApi}/${environment.apiVersion}/RecursosHumanos`
    }
  }

  getGestionesByPersonaId(personaId: number) {
    return this.http.get<number[]>(`${this.url}/Marcaciones/Gestiones/${personaId}`).pipe(
      map(response => {
        return response
      }),
    )
  }
}
